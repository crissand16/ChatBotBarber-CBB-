import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import type { Servicio } from '../interfaces/ServicioInter';
import { obtenerServicios } from '../services/servicioService';
import { obtenerMensajeError } from '../services/apiError';

function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const datos = await obtenerServicios();
        setServicios(datos);
      } catch (err) {
        setError(obtenerMensajeError(err, 'No se pudieron cargar los servicios.'));
      } finally {
        setCargando(false);
      }
    };

    cargarServicios();
  }, []);

  return (
    <Layout>
      <h1>Servicios</h1>

      <p>
        Aquí podrás consultar los servicios disponibles.
      </p>

      {cargando && <p>Cargando servicios...</p>}

      {error && <p className="form-error">{error}</p>}

      {!cargando && !error && (
        <div className="servicios-grid">
          {servicios.map((servicio) => (
            <article key={servicio.id_servicios} className="servicio-card">
              <h3>{servicio.nombre_servicio}</h3>

              {servicio.descripcion_servicio && (
                <p>{servicio.descripcion_servicio}</p>
              )}

              <div className="servicio-meta">
                <span>${servicio.precio_servicio.toLocaleString('es-CO')}</span>
                <span>{servicio.duracion_minutos_servicio} min</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Servicios;
