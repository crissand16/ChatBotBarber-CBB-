from sqlalchemy import text, DateTime
from sqlalchemy.orm import Session
from sqlalchemy.engine import Result
from app.models.agenda import Agenda
from app.schema.agenda_schema import AgendaCreate

# =====================================================
# CREAR UNA AGENDA
# =====================================================

def crear_agenda( 
    db: Session,
    datos: AgendaCreate):
    try:
    # =====================================================
    # 1. VERIFICAR CLIENTE
    # =====================================================

        usuario = db.execute(
            text("""
                SELECT id_usuario
                FROM usuario
                WHERE id_usuario = :id_usuario
            """),
            { #datos.id_usuario para coincidir con la FK
                "id_usuario": datos.id_cliente
            }
        ).first()

        if not usuario:

            raise ValueError(
                "El usuario no existe"
            )


        # =====================================================
        # 2. VERIFICAR DISPONIBILIDAD
        # =====================================================

    #JOIN con servicio_disponibilidad para verificar desde el id_servicio_disponibilidad
        disponibilidad = db.execute(
            text("""
                SELECT
                    d.id_disponibilidad,
                    d.estado_disponibilidad,
                    s.precio_servicio
                FROM servicio_disponibilidad sd

                INNER JOIN disponibilidad d 
                ON sd.id_disponibilidad =
                    d.id_disponibilidad
                
                INNER JOIN servicios s 
                ON sd.id_servicios = s.id_servicios

                WHERE sd.id_servicio_disponibilidad =
                    :id_sd
                FOR UPDATE
            """),
            {
                "id_sd":
                    datos.id_servicio_disponibilidad
            }
        ).first()

        if not disponibilidad:

            raise ValueError(
                "No se encontró el servicio o disponibilidad especificada"
            )


        if disponibilidad.estado_disponibilidad != "disponible":

            raise ValueError(
                "El horario seleccionada ya no está disponible"
            )


        # =========================================================
        # 3. CREAR AGENDA CON EL PRECIO CALCULADO AUTOMÁTICAMENTE
        # =========================================================
        
        # Se crea el objeto ORM con valores del schema
        estado = getattr(datos, "estado_agenda", None) or "pendiente"
        agenda = Agenda(
            id_cliente=datos.id_cliente,
            precio_total=float(disponibilidad.precio_servicio),
            estado_agenda=datos.estado_agenda if getattr(datos, "estado_agenda", None) else "pendiente",
            #getattr se usa para asegurar que si el esquema enviado no incluye estado_agenda
            #el backend no colapse y le asigne el valor 'pendiente' por defecto
            fecha_creacion_agenda=DateTime.now()
        )

        # Guarda en la base de datos
        db.add(agenda)
        db.flush() #Genera el id_agenda sin guardarlo en la bd
        # definitivamente y sin todavía hacer el commit

    # =====================================================
    # 4. REGISTRAR EL DETALLE DE LA AGENDA
    # =====================================================
        sql_detalle = text("""
                    INSERT INTO detalle (id_agenda, id_servicio_disponibilidad)
                    VALUES (:id_agenda, :id_servicio_disponibilidad)
                """)
        db.execute(sql_detalle, {
            "id_agenda": agenda.id_agenda,
            "id_servicio_disponibilidad": datos.id_servicio_disponibilidad
        })

    # =====================================================
    # 5. ACTUALIZAR DISPONIBILIDAD A 'OCUPADO'
    # =====================================================
        sql_update_disp = text("""
            UPDATE disponibilidad
            SET estado_disponibilidad = 'ocupado'
            WHERE id_disponibilidad = :id_disponibilidad
        """)
        db.execute(sql_update_disp, {"id_disponibilidad": disponibilidad.id_disponibilidad})
        db.commit() #Se guarda la agenda, el detalle y la actualización del estado_disponibilidad
        db.refresh(agenda)
        return agenda
    
    except Exception as e:
        db.rollback()
        raise e


def estructurar_agendas(resultado: Result) -> list:
#Agrupa las filas devueltas por SQL unificando múltiples servicios
#pertenecientes a una misma agenda.
      
    agendas_dict = {}

    for row in resultado:
        item = dict(row._mapping)
        id_agenda = item["id_agenda"]

#.get() sirve para extraer el valor de una clave de forma segura
#gestiona la falta de información sin romper la ejecución del código

# Si la agenda no ha sido procesada, se crea el objeto base con Cliente y Especialista
        if id_agenda not in agendas_dict:
            agendas_dict[id_agenda] = {
                "id_agenda": id_agenda,
                "estado_agenda": item["estado_agenda"],
                "precio_total": float(item["precio_total"]) if item.get("precio_total") is not None else 0.0,
                "fecha_creacion_agenda": item["fecha_creacion_agenda"].isoformat() if item.get("fecha_creacion_agenda") is not None else None,
                "fecha_agenda": str(item["fecha_disponibilidad"]) if item.get("fecha_disponibilidad") else None,
                "hora_agenda": str(item["hora_inicio_disponibilidad"]) if item.get("hora_inicio_disponibilidad") else None,
                "cliente": {
                    "id": item["id_cliente"],
                    "nombre": f"{item['nombres_cliente']} {item['apellidos_cliente']}".strip()
                },
                "especialista": {
                    "id": item["id_especialista"],
                    "nombre": f"{item['nombres_especialista']} {item['apellidos_especialista']}".strip()
                },
                "servicios": []
            }

# Se agrega el servicio a la lista de servicios de esta agenda
        agendas_dict[id_agenda]["servicios"].append({
            "id_servicio": item["id_servicios"],
            "nombre": item["nombre_servicio"],
            "precio": float(item["precio_servicio"]) if item.get("precio_servicio") is not None else 0.0
        })

    return list(agendas_dict.values())


# =========================================================
# LISTAR CITAS POR ESPECIALISTA
# =========================================================

def obtener_citas_especialista(
    db: Session,
    id_especialista: str
):

    sql = text("""
        SELECT
            -- =============================================
            -- AGENDA
            -- =============================================

            a.id_agenda,
            a.id_cliente,
            a.estado_agenda,
            a.precio_total,
            a.fecha_creacion_agenda,

            -- =============================================
            -- CLIENTE
            -- =============================================

            cli.id_usuario AS id_cliente,
            cli.nombres_usuario AS nombres_cliente,
            cli.apellidos_usuario AS apellidos_cliente,

            -- =============================================
            -- DISPONIBILIDAD Y ESPECIALISTA
            -- =============================================

            disp.id_disponibilidad,
            disp.fecha_disponibilidad,
            disp.hora_inicio_disponibilidad,
            esp.id_usuario AS id_especialista,
            esp.nombres_usuario AS nombres_especialista,
            esp.apellidos_usuario AS apellidos_especialista,

            -- =============================================
            -- SERVICIO
            -- =============================================
            
            s.id_servicios,
            s.nombre_servicio,
            s.precio_servicio

        FROM agenda a

        INNER JOIN detalle det
            ON a.id_agenda =
               det.id_agenda

        INNER JOIN servicio_disponibilidad sd
            ON det.id_servicio_disponibilidad =
               sd.id_servicio_disponibilidad

        INNER JOIN servicios s
            ON sd.id_servicios =
               s.id_servicios

        INNER JOIN disponibilidad disp
            ON sd.id_disponibilidad =
               disp.id_disponibilidad

        INNER JOIN usuario esp 
            ON disp.id_especialista = 
            esp.id_usuario
        
        INNER JOIN usuario cli
            ON a.id_cliente =
               cli.id_usuario
        WHERE disp.id_especialista = :id_especialista

        ORDER BY
            disp.fecha_disponibilidad DESC,
            disp.hora_inicio_disponibilidad DESC
    """)

    resultado = db.execute(
        sql,
        {
            "id_especialista": id_especialista
        }
    )
    return estructurar_agendas(resultado)

# =========================================================
# LISTAR AGENDAS POR CLIENTE
# =========================================================
def obtener_agendas_por_cliente(
    db: Session,
    id_cliente: str
):
    sql = text("""
        SELECT
            -- AGENDA
            a.id_agenda,
            a.id_cliente,
            a.estado_agenda,
            a.precio_total,
            a.fecha_creacion_agenda,

            -- CLIENTE
            cli.nombres_usuario AS nombres_cliente,
            cli.apellidos_usuario AS apellidos_cliente,

            -- DISPONIBILIDAD Y ESPECIALISTA
            disp.id_disponibilidad,
            disp.fecha_disponibilidad,
            disp.hora_inicio_disponibilidad,
            esp.id_usuario AS id_especialista,
            esp.nombres_usuario AS nombres_especialista,
            esp.apellidos_usuario AS apellidos_especialista,

            -- SERVICIO
            s.id_servicios,
            s.nombre_servicio,
            s.precio_servicio

        FROM agenda a
        INNER JOIN detalle det 
            ON a.id_agenda = 
            det.id_agenda

        INNER JOIN servicio_disponibilidad sd 
            ON det.id_servicio_disponibilidad = 
            sd.id_servicio_disponibilidad

        INNER JOIN servicios s 
            ON sd.id_servicios = 
            s.id_servicios

        INNER JOIN disponibilidad disp 
            ON sd.id_disponibilidad = 
            disp.id_disponibilidad

        INNER JOIN usuario esp 
            ON disp.id_especialista = 
            esp.id_usuario

        INNER JOIN usuario cli 
            ON a.id_cliente = 
            cli.id_usuario

        WHERE a.id_cliente = :id_cliente
        ORDER BY
            disp.fecha_disponibilidad DESC,
            disp.hora_inicio_disponibilidad DESC
    """)

    resultado = db.execute(sql, {"id_cliente": id_cliente})
    return estructurar_agendas(resultado)


# =========================================================
# LISTAR AGENDAS POR FECHA
# =========================================================
def obtener_agendas_por_fecha(
    db: Session,
    fecha: str
):
    sql = text("""
        SELECT
            -- AGENDA
            a.id_agenda,
            a.id_cliente,
            a.estado_agenda,
            a.precio_total,
            a.fecha_creacion_agenda,

            -- CLIENTE
            cli.nombres_usuario AS nombres_cliente,
            cli.apellidos_usuario AS apellidos_cliente,

            -- DISPONIBILIDAD Y ESPECIALISTA
            disp.id_disponibilidad,
            disp.fecha_disponibilidad,
            disp.hora_inicio_disponibilidad,
            esp.id_usuario AS id_especialista,
            esp.nombres_usuario AS nombres_especialista,
            esp.apellidos_usuario AS apellidos_especialista,

            -- SERVICIO
            s.id_servicios,
            s.nombre_servicio,
            s.precio_servicio

        FROM agenda a
        INNER JOIN detalle det 
            ON a.id_agenda = 
            det.id_agenda

        INNER JOIN servicio_disponibilidad sd 
            ON det.id_servicio_disponibilidad = 
            sd.id_servicio_disponibilidad

        INNER JOIN servicios s 
            ON sd.id_servicios = 
            s.id_servicios

        INNER JOIN disponibilidad disp 
            ON sd.id_disponibilidad = 
            disp.id_disponibilidad

        INNER JOIN usuario esp 
            ON disp.id_especialista = 
            esp.id_usuario

        INNER JOIN usuario cli 
            ON a.id_cliente = 
            cli.id_usuario

        WHERE disp.fecha_disponibilidad = :fecha
        ORDER BY
            disp.hora_inicio_disponibilidad ASC,
            esp.nombres_usuario ASC
    """)

    resultado = db.execute(sql, {"fecha": fecha})
    return estructurar_agendas(resultado)