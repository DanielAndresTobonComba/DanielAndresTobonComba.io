'use strict';

// Modal que muestra los datos del usuario con sesión activa
botonUsuario.addEventListener('click', () => {
  modalNombreUsuario.textContent = usuarioActual.nombreUsuario;
  modalCorreo.textContent = usuarioActual.correo;
  modalUsuario.hidden = false;
});

cerrarModalUsuario.addEventListener('click', () => {
  modalUsuario.hidden = true;
});

// Cierra el modal si se hace clic fuera de la tarjeta del modal
modalUsuario.addEventListener('click', (e) => {
  if (e.target === modalUsuario) modalUsuario.hidden = true;
});
