'use strict';

// Permite arrastrar una tarjeta y soltarla en otra columna del tablero
Object.values(listas).forEach((listaEl) => {
  listaEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    listaEl.classList.add('arrastrando-encima');
  });

  listaEl.addEventListener('dragleave', () => {
    listaEl.classList.remove('arrastrando-encima');
  });

  listaEl.addEventListener('drop', (e) => {
    e.preventDefault();
    listaEl.classList.remove('arrastrando-encima');

    const arrastrada = document.querySelector('.tarjeta.arrastrando');
    if (!arrastrada) return;

    const id = arrastrada.dataset.id;
    const nuevoEstado = listaEl.dataset.estado;
    const tarea = tareas.find((t) => t.id === id);
    if (tarea && tarea.estado !== nuevoEstado) {
      tarea.estado = nuevoEstado;
      persistirTareas();
      renderizarTablero();
    }
  });
});
