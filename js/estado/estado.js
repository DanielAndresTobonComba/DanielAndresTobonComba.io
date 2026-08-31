'use strict';

// Estado global de la aplicación
let usuarioActual = null; // { nombreUsuario, correo }
let tareas = [];
let estadoInterfaz = null;

// Texto que se muestra para cada estado de una tarjeta
const ETIQUETA_ESTADO = {
  'por-hacer': 'Por hacer',
  'en-proceso': 'En proceso',
  'terminado': 'Terminado',
};

// Cambia el estado de la interfaz (crear/editar/eliminar) y vuelve a renderizar
function establecerEstadoInterfaz(nuevoEstado) {
  estadoInterfaz = nuevoEstado;
  renderizarPanelesCrear();
  renderizarTablero();
}
