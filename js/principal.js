'use strict';

// Punto de entrada: si hay una sesión guardada la retoma, si no muestra el login
(function iniciar() {
  const nombreUsuarioSesion = obtenerSesion();
  if (nombreUsuarioSesion) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find((u) => u.nombreUsuario === nombreUsuarioSesion);
    if (usuario) {
      iniciarSesion(usuario);
      return;
    }
  }
  mostrarAutenticacion();
})();
