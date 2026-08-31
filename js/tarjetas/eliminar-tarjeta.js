'use strict';

// Mensaje de confirmación antes de borrar una tarjeta
function renderizarConfirmacionEliminar(tarea) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta';
  tarjeta.dataset.id = tarea.id;
  tarjeta.dataset.estado = tarea.estado;

  const descripcion = document.createElement('p');
  descripcion.className = 'descripcion-tarjeta';
  descripcion.textContent = tarea.descripcion;

  const cajaConfirmacion = document.createElement('div');
  cajaConfirmacion.className = 'confirmar-eliminar-tarjeta';

  const mensaje = document.createElement('p');
  mensaje.className = 'texto-eliminar-tarjeta';
  mensaje.textContent = '¿Eliminar esta tarjeta? Esta acción no se puede deshacer.';

  const acciones = document.createElement('div');
  acciones.className = 'acciones-en-linea';

  const botonCancelar = document.createElement('button');
  botonCancelar.type = 'button';
  botonCancelar.className = 'boton boton-contorno boton-pequeno';
  botonCancelar.textContent = 'Cancelar';
  botonCancelar.addEventListener('click', () => establecerEstadoInterfaz(null));

  const botonEliminar = document.createElement('button');
  botonEliminar.type = 'button';
  botonEliminar.className = 'boton boton-peligro boton-pequeno';
  botonEliminar.textContent = 'Eliminar';
  botonEliminar.addEventListener('click', () => {
    tareas = tareas.filter((t) => t.id !== tarea.id);
    persistirTareas();
    establecerEstadoInterfaz(null);
  });

  acciones.appendChild(botonCancelar);
  acciones.appendChild(botonEliminar);
  cajaConfirmacion.appendChild(mensaje);
  cajaConfirmacion.appendChild(acciones);
  tarjeta.appendChild(descripcion);
  tarjeta.appendChild(cajaConfirmacion);

  return tarjeta;
}
