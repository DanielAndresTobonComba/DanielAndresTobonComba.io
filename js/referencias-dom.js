'use strict';

// Referencias a los elementos del DOM usados por toda la app
const pantallaAutenticacion = document.getElementById('pantallaAutenticacion');
const pantallaApp = document.getElementById('pantallaApp');

const pestanaInicioSesion = document.getElementById('pestanaInicioSesion');
const pestanaRegistro = document.getElementById('pestanaRegistro');
const formularioInicioSesion = document.getElementById('formularioInicioSesion');
const formularioRegistro = document.getElementById('formularioRegistro');
const errorInicioSesion = document.getElementById('errorInicioSesion');
const errorRegistro = document.getElementById('errorRegistro');

const botonUsuario = document.getElementById('botonUsuario');
const etiquetaBotonUsuario = document.getElementById('etiquetaBotonUsuario');
const botonCerrarSesion = document.getElementById('botonCerrarSesion');

const modalUsuario = document.getElementById('modalUsuario');
const modalNombreUsuario = document.getElementById('modalNombreUsuario');
const modalCorreo = document.getElementById('modalCorreo');
const cerrarModalUsuario = document.getElementById('cerrarModalUsuario');

// Contenedores de las listas de tarjetas, por estado
const listas = {
  'por-hacer': document.getElementById('lista-por-hacer'),
  'en-proceso': document.getElementById('lista-en-proceso'),
  'terminado': document.getElementById('lista-terminado'),
};

// Paneles para crear una tarjeta nueva, por estado
const panelesCrear = {
  'por-hacer': document.getElementById('crear-por-hacer'),
  'en-proceso': document.getElementById('crear-en-proceso'),
  'terminado': document.getElementById('crear-terminado'),
};
