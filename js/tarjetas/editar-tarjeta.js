'use strict';

// Formulario inline para editar la descripción y el estado de una tarjeta
function renderizarFormularioEdicion(tarea) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta editando';
  tarjeta.dataset.id = tarea.id;
  tarjeta.dataset.estado = tarea.estado;

  const formulario = document.createElement('div');
  formulario.className = 'formulario-editar-tarjeta';

  const areaTexto = document.createElement('textarea');
  areaTexto.className = 'area-texto-en-linea';
  areaTexto.rows = 3;
  areaTexto.value = tarea.descripcion;

  const select = document.createElement('select');
  select.className = 'select-en-linea';
  Object.entries(ETIQUETA_ESTADO).forEach(([valor, etiqueta]) => {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = etiqueta;
    if (valor === tarea.estado) opcion.selected = true;
    select.appendChild(opcion);
  });

  const acciones = document.createElement('div');
  acciones.className = 'acciones-en-linea';

  const botonCancelar = document.createElement('button');
  botonCancelar.type = 'button';
  botonCancelar.className = 'boton boton-contorno boton-pequeno';
  botonCancelar.textContent = 'Cancelar';
  botonCancelar.addEventListener('click', () => establecerEstadoInterfaz(null));

  const botonGuardar = document.createElement('button');
  botonGuardar.type = 'button';
  botonGuardar.className = 'boton boton-primario boton-pequeno';
  botonGuardar.textContent = 'Guardar';
  botonGuardar.addEventListener('click', () => {
    const descripcion = areaTexto.value.trim();
    if (!descripcion) return;
    tarea.descripcion = descripcion;
    tarea.estado = select.value;
    persistirTareas();
    establecerEstadoInterfaz(null);
  });

  acciones.appendChild(botonCancelar);
  acciones.appendChild(botonGuardar);
  formulario.appendChild(areaTexto);
  formulario.appendChild(select);
  formulario.appendChild(acciones);
  tarjeta.appendChild(formulario);

  return tarjeta;
}
