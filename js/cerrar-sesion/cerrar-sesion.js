'use strict';

// Cierra la sesión activa y vuelve a la pantalla de autenticación
botonCerrarSesion.addEventListener('click', () => {
  usuarioActual = null;
  tareas = [];
  estadoInterfaz = null;
  establecerSesion(null);
  mostrarAutenticacion();
});
