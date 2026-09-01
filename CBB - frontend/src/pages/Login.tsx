import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { FormEvent } from 'react';

import type { LoginForm } from '../interfaces/LoginForm';

import {
  validarCorreo,
  validarPassword,
} from '../services/validaciones';

import '../App.css';

function Login() {
  const [formulario, setFormulario] = useState<LoginForm>({
    correo: '',
    password: '',
  });

  const [error, setError] = useState<string>('');

  const manejarCambio = (
    campo: keyof LoginForm,
    valor: string
  ) => {
    setFormulario({
      ...formulario,
      [campo]: valor,
    });
  };

  const manejarEnvio = (
    evento: FormEvent<HTMLFormElement>
  ) => {
    evento.preventDefault();

    setError('');

    if (!validarCorreo(formulario.correo)) {
      setError('Ingrese un correo electrónico válido.');
      return;
    }

    if (!validarPassword(formulario.password)) {
      setError(
        'La contraseña debe tener mínimo 6 caracteres.'
      );
      return;
    }

    console.log('Datos del Login:', formulario);

    alert('Formulario válido. Listo para conectar con FastAPI.');
  };

  return (
    <main className="auth-page">

      <section className="auth-card">

        <div className="auth-header">
          <h1>ChatBotBarber</h1>

          <p>
            Inicia sesión en tu cuenta
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={manejarEnvio}
        >

          <div className="form-group">

            <label htmlFor="correo">
              Correo electrónico
            </label>

            <input
              type="email"
              id="correo"
              value={formulario.correo}
              onChange={(e) =>
                manejarCambio(
                  'correo',
                  e.target.value
                )
              }
              placeholder="correo@ejemplo.com"
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Contraseña
            </label>

            <input
              type="password"
              id="password"
              value={formulario.password}
              onChange={(e) =>
                manejarCambio(
                  'password',
                  e.target.value
                )
              }
              placeholder="Ingrese su contraseña"
            />

          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
          >
            Iniciar sesión
          </button>

        </form>

        <div className="auth-footer">

          <span>
            ¿No tienes una cuenta?
          </span>

          <Link to="/registro">
            Crear cuenta
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Login;