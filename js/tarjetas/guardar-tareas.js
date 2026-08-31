'use strict';

// Guarda las tareas del usuario actual en localStorage
function persistirTareas() {
  if (usuarioActual) guardarTareas(usuarioActual.nombreUsuario, tareas);
}
