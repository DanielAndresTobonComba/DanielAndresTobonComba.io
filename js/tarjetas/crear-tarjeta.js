'use strict';

// Abre o cierra el panel para crear una tarjeta en una columna
document.querySelectorAll('.boton-agregar').forEach((boton) => {
  boton.addEventListener('click', () => {
    const estado = boton.dataset.estado;
    const yaAbierto = estadoInterfaz && estadoInterfaz.modo === 'crear' && estadoInterfaz.estado === estado;
    establecerEstadoInterfaz(yaAbierto ? null : { modo: 'crear', estado });
  });
});

// Muestra u oculta el panel de creación de cada columna
function renderizarPanelesCrear() {
  Object.entries(panelesCrear).forEach(([estado, panel]) => {
    const abierto = estadoInterfaz && estadoInterfaz.modo === 'crear' && estadoInterfaz.estado === estado;
    panel.hidden = !abierto;

    const areaTexto = panel.querySelector('.area-texto-en-linea');
    if (abierto) {
      areaTexto.value = '';
      areaTexto.focus();
    }
  });
}

// Botones de cancelar/confirmar dentro de cada panel de creación
Object.entries(panelesCrear).forEach(([estado, panel]) => {
  const areaTexto = panel.querySelector('.area-texto-en-linea');

  panel.querySelector('[data-accion="cancelar-crear"]').addEventListener('click', () => {
    establecerEstadoInterfaz(null);
  });

  panel.querySelector('[data-accion="confirmar-crear"]').addEventListener('click', () => {
    const descripcion = areaTexto.value.trim();
    if (!descripcion) return;

    tareas.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      descripcion,
      estado,
    });
    persistirTareas();
    establecerEstadoInterfaz(null);
  });
});
