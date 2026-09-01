import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { FormEvent } from 'react';

import type { RegistroForm } from '../interfaces/RegistroForm';

import {
  validarCorreo,
  validarPassword,
  validarTelefono,
} from '../services/validaciones';

import '../App.css';

function Registro() {
  const [formulario, setFormulario] =
    useState<RegistroForm>({
      nombre: '',
      correo: '',
      telefono: '',
      password: '',
      confirmarPassword: '',
    });

  const [error, setError] = useState<string>('');

  const manejarCambio = (
    campo: keyof RegistroForm,
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

    if (formulario.nombre.trim().length < 3) {
      setError(
        'El nombre debe tener mínimo 3 caracteres.'
      );
      return;
    }

    if (!validarCorreo(formulario.correo)) {
      setError(
        'Ingrese un correo electrónico válido.'
      );
      return;
    }

    if (!validarTelefono(formulario.telefono)) {
      setError(
        'Ingrese un número de teléfono válido.'
      );
      return;
    }

    if (!validarPassword(formulario.password)) {
      setError(
        'La contraseña debe tener mínimo 6 caracteres.'
      );
      return;
    }

    if (
      formulario.password !==
      formulario.confirmarPassword
    ) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    console.log(
      'Datos del registro:',
      formulario
    );

    alert(
      'Registro válido. Listo para conectar con FastAPI.'
    );
  };

  return (
    <main className="auth-page">

      <section className="auth-card registro-card">

        <div className="auth-header">

          <h1>Crear cuenta</h1>

          <p>
            Regístrate en ChatBotBarber
          </p>

        </div>

        <form
          className="auth-form"
          onSubmit={manejarEnvio}
        >

          <div className="form-group">

            <label htmlFor="nombre">
              Nombre completo
            </label>

            <input
              type="text"
              id="nombre"
              value={formulario.nombre}
              onChange={(e) =>
                manejarCambio(
                  'nombre',
                  e.target.value
                )
              }
              placeholder="Ingrese su nombre"
            />

          </div>

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

            <label htmlFor="telefono">
              Teléfono
            </label>

            <input
              type="tel"
              id="telefono"
              value={formulario.telefono}
              onChange={(e) =>
                manejarCambio(
                  'telefono',
                  e.target.value
                )
              }
              placeholder="Ingrese su teléfono"
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
              placeholder="Mínimo 6 caracteres"
            />

          </div>

          <div className="form-group">

            <label htmlFor="confirmarPassword">
              Confirmar contraseña
            </label>

            <input
              type="password"
              id="confirmarPassword"
              value={formulario.confirmarPassword}
              onChange={(e) =>
                manejarCambio(
                  'confirmarPassword',
                  e.target.value
                )
              }
              placeholder="Repita su contraseña"
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
            Crear cuenta
          </button>

        </form>

        <div className="auth-footer">

          <span>
            ¿Ya tienes una cuenta?
          </span>

          <Link to="/login">
            Iniciar sesión
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Registro;