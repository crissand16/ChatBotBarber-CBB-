import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Inicio from '../pages/Inicio';

import Chat from '../pages/Chat';
import Citas from '../pages/Citas';
import Servicios from '../pages/Servicios';
import Perfil from '../pages/Perfil';
import Contacto from '../pages/Contacto';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route
          path="/inicio"
          element={<Inicio />}
        />

        <Route
          path="/chat"
          element={<Chat />}
        />

        <Route
          path="/citas"
          element={<Citas />}
        />

        <Route
          path="/servicios"
          element={<Servicios />}
        />

        <Route
          path="/perfil"
          element={<Perfil />}
        />

        <Route
          path="/contacto"
          element={<Contacto />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;