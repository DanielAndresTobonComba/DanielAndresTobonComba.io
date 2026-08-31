'use strict';

// Registro de un usuario nuevo
formularioRegistro.addEventListener('submit', (e) => {
  e.preventDefault();
  errorRegistro.textContent = '';

  const nombreUsuario = document.getElementById('registroNombreUsuario').value.trim();
  const correo = document.getElementById('registroCorreo').value.trim();
  const contrasena = document.getElementById('registroContrasena').value;
  const contrasena2 = document.getElementById('registroContrasena2').value;

  if (!nombreUsuario || !correo || !contrasena) {
    errorRegistro.textContent = 'Completa todos los campos.';
    return;
  }
  if (contrasena !== contrasena2) {
    errorRegistro.textContent = 'Las contraseñas no coinciden.';
    return;
  }

  const usuarios = obtenerUsuarios();
  if (usuarios.some((u) => u.nombreUsuario.toLowerCase() === nombreUsuario.toLowerCase())) {
    errorRegistro.textContent = 'Ese nombre de usuario ya existe.';
    return;
  }

  usuarios.push({ nombreUsuario, correo, contrasena });
  guardarUsuarios(usuarios);

  formularioRegistro.reset();
  errorInicioSesion.textContent = '';
  cambiarPestana('inicio-sesion');
  document.getElementById('inicioSesionNombreUsuario').value = nombreUsuario;
});
