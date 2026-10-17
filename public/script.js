// Find the parts of the page we need
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty');
const filterButtons = document.querySelectorAll('.filter');

let allTasks = [];
let currentFilter = 'all';

// Show today's date and a greeting based on the time of day
function setHeader() {
  const now = new Date();
  document.getElementById('today').textContent = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  const hour = now.getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  document.getElementById('greeting').textContent = `${greeting}, Destiny`;
}

// Get all tasks from the backend
async function loadTasks() {
  const res = await fetch('/api/tasks');
  allTasks = await res.json();
  render();
}

// Update the counts, progress ring and list on screen
function render() {
  const total = allTasks.length;
  const done = allTasks.filter((task) => task.done).length;
  const left = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById('count-total').textContent = total;
  document.getElementById('count-done').textContent = done;
  document.getElementById('count-left').textContent = left;
  document.getElementById('percent').textContent = `${percent}%`;
  document.getElementById('ring').style.setProperty('--progress', percent);

  let summary = `You have ${left} ${left === 1 ? 'task' : 'tasks'} left to do.`;
  if (total === 0) summary = "No tasks yet. What's first?";
  else if (left === 0) summary = 'Everything is done. Nice work.';
  document.getElementById('summary').textContent = summary;

  let visible = allTasks;
  if (currentFilter === 'todo') visible = allTasks.filter((task) => !task.done);
  if (currentFilter === 'done') visible = allTasks.filter((task) => task.done);

  list.innerHTML = '';

  visible.forEach((task) => {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Mark "${task.title}" as done`);
    checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));

    const span = document.createElement('span');
    span.textContent = task.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', `Delete "${task.title}"`);
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.append(checkbox, span, deleteBtn);
    list.appendChild(li);
  });

  if (visible.length === 0) {
    emptyMessage.hidden = false;
    if (currentFilter === 'done') emptyMessage.textContent = 'No finished tasks yet.';
    else if (currentFilter === 'todo') emptyMessage.textContent = 'Nothing left to do.';
    else emptyMessage.textContent = 'Nothing here yet. Add your first task above.';
  } else {
    emptyMessage.hidden = true;
  }
}

// Switch between All, To do and Done
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    render();
  });
});

// When Add is clicked, send the new task to the backend
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value })
  });

  input.value = '';
  loadTasks();
});

// When a task is ticked, tell the backend to update it
async function toggleTask(id, done) {
  await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done })
  });
  loadTasks();
}

// When Delete is clicked, tell the backend to remove the task
async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

// Start the page
setHeader();
loadTasks();