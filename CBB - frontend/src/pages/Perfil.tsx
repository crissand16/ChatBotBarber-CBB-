import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

function Perfil() {
  const { usuario } = useAuth();

  return (
    <Layout>
      <h1>Mi perfil</h1>

      <p>
        Aquí podrás consultar y modificar tu información.
      </p>

      {usuario && (
        <div className="servicio-card" style={{ maxWidth: 420, marginTop: 20 }}>
          <p><strong>Nombre:</strong> {usuario.nombres} {usuario.apellidos}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
        </div>
      )}
    </Layout>
  );
}

export default Perfil;
