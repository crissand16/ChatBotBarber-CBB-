import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import type { Agenda } from '../interfaces/AgendaInter';
import { obtenerAgendasPorCliente } from '../services/agendaService';
import { obtenerMensajeError } from '../services/apiError';
import { useAuth } from '../context/AuthContext';

const ESTADO_A_CLASE: Record<string, string> = {
  pendiente: 'badge-pendiente',
  confirmada: 'badge-confirmada',
  cancelada: 'badge-cancelada',
};

function Citas() {
  const { usuario } = useAuth();

  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!usuario) return;

    const cargarAgendas = async () => {
      try {
        const datos = await obtenerAgendasPorCliente(usuario.id_usuario);
        setAgendas(datos);
      } catch (err) {
        setError(obtenerMensajeError(err, 'No se pudieron cargar tus citas.'));
      } finally {
        setCargando(false);
      }
    };

    cargarAgendas();
  }, [usuario]);

  return (
    <Layout>
      <h1>Mis citas</h1>

      <p>
        Aquí podrás consultar y gestionar tus citas.
      </p>

      {cargando && <p>Cargando citas...</p>}

      {error && <p className="form-error">{error}</p>}

      {!cargando && !error && agendas.length === 0 && (
        <p>Todavía no tienes citas agendadas.</p>
      )}

      {!cargando && !error && agendas.length > 0 && (
        <div className="citas-lista">
          {agendas.map((agenda) => (
            <article key={agenda.id_agenda} className="cita-card">
              <div className="cita-card-header">
                <strong>{agenda.fecha_agenda ?? 'Sin fecha'}</strong>
                <span>{agenda.hora_agenda ?? ''}</span>
                <span
                  className={
                    'badge ' +
                    (ESTADO_A_CLASE[agenda.estado_agenda] ?? 'badge-pendiente')
                  }
                >
                  {agenda.estado_agenda}
                </span>
              </div>

              <p>Con {agenda.especialista.nombre}</p>

              <ul>
                {agenda.servicios.map((servicio) => (
                  <li key={servicio.id_servicio}>
                    {servicio.nombre} — $
                    {servicio.precio.toLocaleString('es-CO')}
                  </li>
                ))}
              </ul>

              <div className="cita-card-footer">
                <strong>
                  Total: ${agenda.precio_total.toLocaleString('es-CO')}
                </strong>
                <Button variant="danger">
                  Cancelar cita
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Citas;
