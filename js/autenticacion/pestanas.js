'use strict';

// Pestañas de la pantalla de autenticación (iniciar sesión / crear cuenta)
pestanaInicioSesion.addEventListener('click', () => cambiarPestana('inicio-sesion'));
pestanaRegistro.addEventListener('click', () => cambiarPestana('registro'));

// Muestra el formulario de inicio de sesión o el de registro
function cambiarPestana(cual) {
  const esInicioSesion = cual === 'inicio-sesion';
  pestanaInicioSesion.classList.toggle('activa', esInicioSesion);
  pestanaRegistro.classList.toggle('activa', !esInicioSesion);
  formularioInicioSesion.hidden = !esInicioSesion;
  formularioRegistro.hidden = esInicioSesion;
  errorInicioSesion.textContent = '';
  errorRegistro.textContent = '';
}
