'use strict';

// Cambia entre la pantalla de autenticación y la pantalla de la app
function mostrarApp() {
  pantallaAutenticacion.hidden = true;
  pantallaApp.hidden = false;
  etiquetaBotonUsuario.textContent = usuarioActual.nombreUsuario;
  renderizarPanelesCrear();
  renderizarTablero();
}

function mostrarAutenticacion() {
  pantallaApp.hidden = true;
  pantallaAutenticacion.hidden = false;
  cambiarPestana('inicio-sesion');
}
