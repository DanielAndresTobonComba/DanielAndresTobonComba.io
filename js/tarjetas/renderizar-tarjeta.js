'use strict';

// Dibuja las tres columnas del tablero con sus tarjetas
function renderizarTablero() {
  Object.entries(listas).forEach(([estado, listaEl]) => {
    listaEl.innerHTML = '';
    const items = tareas.filter((t) => t.estado === estado);

    if (items.length === 0) {
      const sugerencia = document.createElement('div');
      sugerencia.className = 'sin-tarjetas';
      sugerencia.textContent = 'Sin tarjetas';
      listaEl.appendChild(sugerencia);
      return;
    }

    items.forEach((tarea) => listaEl.appendChild(renderizarTarjeta(tarea)));
  });
}

// Elige qué versión de la tarjeta pintar según el estado de la interfaz
function renderizarTarjeta(tarea) {
  if (estadoInterfaz && estadoInterfaz.modo === 'editar' && estadoInterfaz.idTarea === tarea.id) {
    return renderizarFormularioEdicion(tarea);
  }
  if (estadoInterfaz && estadoInterfaz.modo === 'eliminar' && estadoInterfaz.idTarea === tarea.id) {
    return renderizarConfirmacionEliminar(tarea);
  }
  return renderizarTarjetaNormal(tarea);
}

// Tarjeta en su vista normal (descripción + acciones editar/eliminar)
function renderizarTarjetaNormal(tarea) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta';
  tarjeta.draggable = true;
  tarjeta.dataset.id = tarea.id;
  tarjeta.dataset.estado = tarea.estado;

  const descripcion = document.createElement('p');
  descripcion.className = 'descripcion-tarjeta';
  descripcion.textContent = tarea.descripcion;

  const pie = document.createElement('div');
  pie.className = 'pie-tarjeta';

  const insignia = document.createElement('span');
  insignia.className = `insignia-estado ${tarea.estado}`;
  insignia.textContent = ETIQUETA_ESTADO[tarea.estado];

  const acciones = document.createElement('div');
  acciones.className = 'acciones-tarjeta';

  const botonEditar = document.createElement('button');
  botonEditar.className = 'boton-editar';
  botonEditar.type = 'button';
  botonEditar.textContent = 'Editar';
  botonEditar.addEventListener('click', () => establecerEstadoInterfaz({ modo: 'editar', idTarea: tarea.id }));

  const botonEliminar = document.createElement('button');
  botonEliminar.className = 'boton-eliminar';
  botonEliminar.type = 'button';
  botonEliminar.textContent = 'Eliminar';
  botonEliminar.addEventListener('click', () => establecerEstadoInterfaz({ modo: 'eliminar', idTarea: tarea.id }));

  acciones.appendChild(botonEditar);
  acciones.appendChild(botonEliminar);
  pie.appendChild(insignia);
  pie.appendChild(acciones);
  tarjeta.appendChild(descripcion);
  tarjeta.appendChild(pie);

  // Clases usadas por el arrastrar-y-soltar del tablero
  tarjeta.addEventListener('dragstart', () => {
    tarjeta.classList.add('arrastrando');
  });
  tarjeta.addEventListener('dragend', () => {
    tarjeta.classList.remove('arrastrando');
  });

  return tarjeta;
}
