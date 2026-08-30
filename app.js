'use strict';

/* ===================== Storage helpers ===================== */
const USERS_KEY = 'kanban_users';
const SESSION_KEY = 'kanban_session';
const tasksKey = (username) => `kanban_tasks_${username}`;

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  return localStorage.getItem(SESSION_KEY);
}

function setSession(username) {
  if (username) localStorage.setItem(SESSION_KEY, username);
  else localStorage.removeItem(SESSION_KEY);
}

function getTasks(username) {
  try {
    return JSON.parse(localStorage.getItem(tasksKey(username))) || [];
  } catch {
    return [];
  }
}

function saveTasks(username, tasks) {
  localStorage.setItem(tasksKey(username), JSON.stringify(tasks));
}

/* ===================== State ===================== */
let currentUser = null; // { username, email }
let tasks = [];
// uiState drives which inline section is open:
// { mode: 'create', status } | { mode: 'edit', taskId } | { mode: 'delete', taskId } | null
let uiState = null;

const STATUS_LABEL = {
  'todo': 'Por hacer',
  'in-progress': 'En proceso',
  'done': 'Terminado',
};

/* ===================== DOM refs ===================== */
const authScreen = document.getElementById('authScreen');
const appScreen = document.getElementById('appScreen');

const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

const userBtn = document.getElementById('userBtn');
const userBtnLabel = document.getElementById('userBtnLabel');
const logoutBtn = document.getElementById('logoutBtn');

const userModal = document.getElementById('userModal');
const modalUsername = document.getElementById('modalUsername');
const modalEmail = document.getElementById('modalEmail');
const closeUserModal = document.getElementById('closeUserModal');

const lists = {
  'todo': document.getElementById('list-todo'),
  'in-progress': document.getElementById('list-in-progress'),
  'done': document.getElementById('list-done'),
};

const createPanels = {
  'todo': document.getElementById('create-todo'),
  'in-progress': document.getElementById('create-in-progress'),
  'done': document.getElementById('create-done'),
};

/* ===================== Auth screen tabs ===================== */
tabLogin.addEventListener('click', () => switchTab('login'));
tabRegister.addEventListener('click', () => switchTab('register'));

function switchTab(which) {
  const isLogin = which === 'login';
  tabLogin.classList.toggle('active', isLogin);
  tabRegister.classList.toggle('active', !isLogin);
  loginForm.hidden = !isLogin;
  registerForm.hidden = isLogin;
  loginError.textContent = '';
  registerError.textContent = '';
}

/* ===================== Register ===================== */
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  registerError.textContent = '';

  const username = document.getElementById('registerUsername').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const password2 = document.getElementById('registerPassword2').value;

  if (!username || !email || !password) {
    registerError.textContent = 'Completa todos los campos.';
    return;
  }
  if (password !== password2) {
    registerError.textContent = 'Las contraseñas no coinciden.';
    return;
  }

  const users = getUsers();
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    registerError.textContent = 'Ese nombre de usuario ya existe.';
    return;
  }

  users.push({ username, email, password });
  saveUsers(users);

  registerForm.reset();
  loginError.textContent = '';
  switchTab('login');
  document.getElementById('loginUsername').value = username;
});

/* ===================== Login ===================== */
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  const users = getUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (!user) {
    loginError.textContent = 'Usuario o contraseña incorrectos.';
    return;
  }

  loginForm.reset();
  logIn(user);
});

function logIn(user) {
  currentUser = { username: user.username, email: user.email };
  setSession(user.username);
  tasks = getTasks(user.username);
  uiState = null;
  showApp();
}

/* ===================== Logout ===================== */
logoutBtn.addEventListener('click', () => {
  currentUser = null;
  tasks = [];
  uiState = null;
  setSession(null);
  showAuth();
});

/* ===================== Screen switching ===================== */
function showApp() {
  authScreen.hidden = true;
  appScreen.hidden = false;
  userBtnLabel.textContent = currentUser.username;
  renderCreatePanels();
  renderBoard();
}

function showAuth() {
  appScreen.hidden = true;
  authScreen.hidden = false;
  switchTab('login');
}

/* ===================== User modal ===================== */
userBtn.addEventListener('click', () => {
  modalUsername.textContent = currentUser.username;
  modalEmail.textContent = currentUser.email;
  userModal.hidden = false;
});

closeUserModal.addEventListener('click', () => {
  userModal.hidden = true;
});

userModal.addEventListener('click', (e) => {
  if (e.target === userModal) userModal.hidden = true;
});

/* ===================== UI state (inline create/edit/delete) ===================== */
function setUiState(newState) {
  uiState = newState;
  renderCreatePanels();
  renderBoard();
}

document.querySelectorAll('.add-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const status = btn.dataset.status;
    const alreadyOpen = uiState && uiState.mode === 'create' && uiState.status === status;
    setUiState(alreadyOpen ? null : { mode: 'create', status });
  });
});

function renderCreatePanels() {
  Object.entries(createPanels).forEach(([status, panel]) => {
    const isOpen = uiState && uiState.mode === 'create' && uiState.status === status;
    panel.hidden = !isOpen;

    const textarea = panel.querySelector('.inline-textarea');
    if (isOpen) {
      textarea.value = '';
      textarea.focus();
    }
  });
}

Object.entries(createPanels).forEach(([status, panel]) => {
  const textarea = panel.querySelector('.inline-textarea');

  panel.querySelector('[data-action="cancel-create"]').addEventListener('click', () => {
    setUiState(null);
  });

  panel.querySelector('[data-action="confirm-create"]').addEventListener('click', () => {
    const description = textarea.value.trim();
    if (!description) return;

    tasks.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      description,
      status,
    });
    persistTasks();
    setUiState(null);
  });
});

/* ===================== Persistence ===================== */
function persistTasks() {
  if (currentUser) saveTasks(currentUser.username, tasks);
}

/* ===================== Rendering ===================== */
function renderBoard() {
  Object.entries(lists).forEach(([status, listEl]) => {
    listEl.innerHTML = '';
    const items = tasks.filter((t) => t.status === status);

    if (items.length === 0) {
      const hint = document.createElement('div');
      hint.className = 'empty-hint';
      hint.textContent = 'Sin tarjetas';
      listEl.appendChild(hint);
      return;
    }

    items.forEach((task) => listEl.appendChild(renderCard(task)));
  });
}

function renderCard(task) {
  if (uiState && uiState.mode === 'edit' && uiState.taskId === task.id) {
    return renderCardEditForm(task);
  }
  if (uiState && uiState.mode === 'delete' && uiState.taskId === task.id) {
    return renderCardDeleteConfirm(task);
  }
  return renderCardNormal(task);
}

function renderCardNormal(task) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.dataset.id = task.id;
  card.dataset.status = task.status;

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = task.description;

  const footer = document.createElement('div');
  footer.className = 'card-footer';

  const badge = document.createElement('span');
  badge.className = `status-badge ${task.status}`;
  badge.textContent = STATUS_LABEL[task.status];

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.type = 'button';
  editBtn.textContent = 'Editar';
  editBtn.addEventListener('click', () => setUiState({ mode: 'edit', taskId: task.id }));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Eliminar';
  deleteBtn.addEventListener('click', () => setUiState({ mode: 'delete', taskId: task.id }));

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  footer.appendChild(badge);
  footer.appendChild(actions);
  card.appendChild(desc);
  card.appendChild(footer);

  card.addEventListener('dragstart', () => {
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });

  return card;
}

function renderCardEditForm(task) {
  const card = document.createElement('div');
  card.className = 'card editing';
  card.dataset.id = task.id;
  card.dataset.status = task.status;

  const form = document.createElement('div');
  form.className = 'card-edit-form';

  const textarea = document.createElement('textarea');
  textarea.className = 'inline-textarea';
  textarea.rows = 3;
  textarea.value = task.description;

  const select = document.createElement('select');
  select.className = 'inline-select';
  Object.entries(STATUS_LABEL).forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (value === task.status) option.selected = true;
    select.appendChild(option);
  });

  const actions = document.createElement('div');
  actions.className = 'inline-actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn-outline btn-sm';
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.addEventListener('click', () => setUiState(null));

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn btn-primary btn-sm';
  saveBtn.textContent = 'Guardar';
  saveBtn.addEventListener('click', () => {
    const description = textarea.value.trim();
    if (!description) return;
    task.description = description;
    task.status = select.value;
    persistTasks();
    setUiState(null);
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(saveBtn);
  form.appendChild(textarea);
  form.appendChild(select);
  form.appendChild(actions);
  card.appendChild(form);

  return card;
}

function renderCardDeleteConfirm(task) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = task.id;
  card.dataset.status = task.status;

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = task.description;

  const confirmBox = document.createElement('div');
  confirmBox.className = 'card-delete-confirm';

  const message = document.createElement('p');
  message.className = 'card-delete-text';
  message.textContent = '¿Eliminar esta tarjeta? Esta acción no se puede deshacer.';

  const actions = document.createElement('div');
  actions.className = 'inline-actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn-outline btn-sm';
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.addEventListener('click', () => setUiState(null));

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-danger btn-sm';
  deleteBtn.textContent = 'Eliminar';
  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    persistTasks();
    setUiState(null);
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(deleteBtn);
  confirmBox.appendChild(message);
  confirmBox.appendChild(actions);
  card.appendChild(desc);
  card.appendChild(confirmBox);

  return card;
}

/* ===================== Drag and drop ===================== */
Object.values(lists).forEach((listEl) => {
  listEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    listEl.classList.add('drag-over');
  });

  listEl.addEventListener('dragleave', () => {
    listEl.classList.remove('drag-over');
  });

  listEl.addEventListener('drop', (e) => {
    e.preventDefault();
    listEl.classList.remove('drag-over');

    const dragging = document.querySelector('.card.dragging');
    if (!dragging) return;

    const id = dragging.dataset.id;
    const newStatus = listEl.dataset.status;
    const task = tasks.find((t) => t.id === id);
    if (task && task.status !== newStatus) {
      task.status = newStatus;
      persistTasks();
      renderBoard();
    }
  });
});

/* ===================== Init: resume session ===================== */
(function init() {
  const sessionUsername = getSession();
  if (sessionUsername) {
    const users = getUsers();
    const user = users.find((u) => u.username === sessionUsername);
    if (user) {
      logIn(user);
      return;
    }
  }
  showAuth();
})();
