import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>ChatBotBarber</h2>
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
        <NavLink to="/login">
          🚪 Cerrar sesión
        </NavLink>
      </div>

    </aside>
  );
}

export default Sidebar;