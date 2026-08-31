'use strict';

// Funciones para leer y escribir datos en localStorage
const CLAVE_USUARIOS = '';
const CLAVE_SESION = 'kanban_session';
const claveTareas = (nombreUsuario) => `kanban_tasks_${nombreUsuario}`;

// Obtiene la lista de usuarios registrados
function obtenerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
  } catch {
    return [];
  }
}

// Guarda la lista de usuarios registrados
function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// Devuelve el nombre de usuario con sesión activa (o null)
function obtenerSesion() {
  return localStorage.getItem(CLAVE_SESION);
}

// Guarda o borra el usuario con sesión activa
function establecerSesion(nombreUsuario) {
  if (nombreUsuario) localStorage.setItem(CLAVE_SESION, nombreUsuario);
  else localStorage.removeItem(CLAVE_SESION);
}

// Obtiene las tareas guardadas de un usuario
function obtenerTareas(nombreUsuario) {
  try {
    return JSON.parse(localStorage.getItem(claveTareas(nombreUsuario))) || [];
  } catch {
    return [];
  }
}

// Guarda las tareas de un usuario
function guardarTareas(nombreUsuario, tareas) {
  localStorage.setItem(claveTareas(nombreUsuario), JSON.stringify(tareas));
}
