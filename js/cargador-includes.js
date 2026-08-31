'use strict';

// Trae los fragmentos HTML y luego carga los scripts de la app en orden
const SCRIPTS_APP = [
  'almacenamiento/almacenamiento.js',
  'estado/estado.js',
  'referencias-dom.js',
  'pantallas/pantallas.js',
  'autenticacion/pestanas.js',
  'autenticacion/registro.js',
  'autenticacion/iniciar-sesion.js',
  'cerrar-sesion/cerrar-sesion.js',
  'usuario/perfil-usuario.js',
  'tarjetas/guardar-tareas.js',
  'tarjetas/renderizar-tarjeta.js',
  'tarjetas/crear-tarjeta.js',
  'tarjetas/editar-tarjeta.js',
  'tarjetas/eliminar-tarjeta.js',
  'tablero/arrastrar-soltar.js',
  'principal.js',
];

// Reemplaza un elemento con data-include por el HTML que trae por fetch
async function incluirHtml(el) {
  const ruta = el.getAttribute('data-include');
  const respuesta = await fetch(ruta);
  const html = await respuesta.text();
  const plantilla = document.createElement('template');
  plantilla.innerHTML = html.trim();
  el.replaceWith(...plantilla.content.childNodes);
}

// Resuelve los data-include de forma recursiva (un fragmento puede incluir otros)
async function resolverIncludes() {
  let pendientes = Array.from(document.querySelectorAll('[data-include]'));
  while (pendientes.length) {
    await Promise.all(pendientes.map(incluirHtml));
    pendientes = Array.from(document.querySelectorAll('[data-include]'));
  }
}

// Agrega un <script> al final del body y espera a que cargue
function cargarScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.body.appendChild(script);
  });
}

// Carga los scripts de la app uno por uno, respetando el orden de dependencias
async function cargarScriptsApp() {
  for (const rutaRelativa of SCRIPTS_APP) {
    await cargarScript(`js/${rutaRelativa}`);
  }
}

(async function iniciarApp() {
  await resolverIncludes();
  await cargarScriptsApp();
})();
