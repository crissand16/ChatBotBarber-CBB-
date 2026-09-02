import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>ChatBotBarber</h2>
        {usuario && (
          <p className="sidebar-usuario">
            {usuario.nombres} {usuario.apellidos}
          </p>
        )}
      </div>

      <nav className="sidebar-menu">

        <NavLink to="/inicio">
          🏠 Inicio
        </NavLink>

        <NavLink to="/chat">
          🤖 ChatBot
        </NavLink>

        <NavLink to="/citas">
          📅 Citas
        </NavLink>

        <NavLink to="/servicios">
          ✂️ Servicios
        </NavLink>

        <NavLink to="/perfil">
          👤 Perfil
        </NavLink>

        <NavLink to="/contacto">
          📞 Contacto
        </NavLink>

      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-logout"
          onClick={manejarCerrarSesion}
        >
          🚪 Cerrar sesión
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
