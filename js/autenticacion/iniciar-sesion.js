'use strict';

// Inicio de sesión de un usuario ya registrado
formularioInicioSesion.addEventListener('submit', (e) => {
  e.preventDefault();
  errorInicioSesion.textContent = '';

  const nombreUsuario = document.getElementById('inicioSesionNombreUsuario').value.trim();
  const contrasena = document.getElementById('inicioSesionContrasena').value;

  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(
    (u) => u.nombreUsuario.toLowerCase() === nombreUsuario.toLowerCase() && u.contrasena === contrasena
  );

  if (!usuario) {
    errorInicioSesion.textContent = 'Usuario o contraseña incorrectos.';
    return;
  }

  formularioInicioSesion.reset();
  iniciarSesion(usuario);
});

// Deja al usuario logueado, carga sus tareas y muestra la app
function iniciarSesion(usuario) {
  usuarioActual = { nombreUsuario: usuario.nombreUsuario, correo: usuario.correo };
  establecerSesion(usuario.nombreUsuario);
  tareas = obtenerTareas(usuario.nombreUsuario);
  estadoInterfaz = null;
  mostrarApp();
}
