// ==========================================
// 1. ДАННЫЕ И ХРАНИЛИЩЕ
// ==========================================

let tasks = [];
let currentFilter = "all";

const VALID_PRIORITIES = ["low", "normal", "high"];
const VALID_FILTERS = ["all", "active", "done"];

function isValidTask(task) {
  if (!task || typeof task !== "object") return false;
  if (typeof task.id !== "string" || task.id.trim() === "") return false;
  if (typeof task.title !== "string") return false;

  const trimmedTitle = task.title.trim();
  if (trimmedTitle.length === 0 || trimmedTitle.length > 100) return false;

  if (typeof task.done !== "boolean") return false;
  if (!VALID_PRIORITIES.includes(task.priority)) return false;
  if (typeof task.createdAt !== "string") return false;

  return true;
}

function loadTasks() {
  try {
    const raw = localStorage.getItem("tasks");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTask);
  } catch (error) {
    console.warn("Не удалось загрузить задачи из localStorage:", error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.warn("Не удалось сохранить задачи в localStorage:", error);
  }
}

function loadFilter() {
  try {
    const raw = localStorage.getItem("currentFilter");
    if (!raw) return "all";
    if (VALID_FILTERS.includes(raw)) return raw;
    return "all";
  } catch (error) {
    console.warn("Не удалось загрузить фильтр из localStorage:", error);
    return "all";
  }
}

function saveFilter() {
  try {
    localStorage.setItem("currentFilter", currentFilter);
  } catch (error) {
    console.warn("Не удалось сохранить фильтр в localStorage:", error);
  }
}

// ==========================================
// 2. ФУНКЦИИ ИЗМЕНЕНИЯ ДАННЫХ
// ==========================================

function addTask(title, priority) {
  const newTask = {
    id: crypto.randomUUID(),
    title: title.trim(),
    done: false,
    priority: priority,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks(); // ← ЕДИНСТВЕННАЯ ВЕРСИЯ: с сохранением!
  render();
}

function toggleTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  task.done = !task.done;
  saveTasks(); // ← ЕДИНСТВЕННАЯ ВЕРСИЯ: с сохранением!
  render();
}

function removeTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks(); // ← ЕДИНСТВЕННАЯ ВЕРСИЯ: с сохранением!
  render();
}

function clearDoneTasks() {
  tasks = tasks.filter((task) => !task.done);
  saveTasks(); // ← ЕДИНСТВЕННАЯ ВЕРСИЯ: с сохранением!
  render();
}

function normalizeTitle(title) {
  return title.trim().toLowerCase();
}

function validateTitle(title) {
  const trimmed = title.trim();

  if (trimmed === "") return "Введите название задачи";
  if (trimmed.length > 100) return "Название не должно превышать 100 символов";

  const normalized = normalizeTitle(title);
  const isDuplicate = tasks.some(
    (task) => !task.done && normalizeTitle(task.title) === normalized,
  );

  if (isDuplicate) return "Такая задача уже есть";

  return "";
}

function setFieldError(control, message) {
  const field = control.closest(".field");
  const hint = field.querySelector(".field__hint");
  const hasError = message !== "";

  field.classList.toggle("field--error", hasError);
  control.setAttribute("aria-invalid", String(hasError));
  if (hint) hint.textContent = message;
}

// ==========================================
// 3. ОТРИСОВКА (РЕНДЕР) И DOM-ЭЛЕМЕНТЫ
// ==========================================

// Собираем ВСЕ запросы к DOM здесь, чтобы они были доступны в render()
const taskList = document.querySelector("#task-list");
const taskTemplate = document.querySelector("#task-template");
const emptyState = document.querySelector("#empty-state");
const taskCounter = document.querySelector("#task-counter");
const clearDoneBtn = document.querySelector("#clear-done-btn"); // ← Перенесено сюда

function getPriorityLabel(priority) {
  const labels = { low: "Низкий", normal: "Обычный", high: "Высокий" };
  return labels[priority] || priority;
}

function render() {
  let visibleTasks;
  if (currentFilter === "active") {
    visibleTasks = tasks.filter((task) => !task.done);
  } else if (currentFilter === "done") {
    visibleTasks = tasks.filter((task) => task.done);
  } else {
    visibleTasks = tasks;
  }

  const totalTasks = tasks.length;
  const remainingTasks = tasks.filter((task) => !task.done).length;
  const doneTasks = totalTasks - remainingTasks;

  taskCounter.textContent = `Осталось: ${remainingTasks} из ${totalTasks}`;

  // Теперь clearDoneBtn гарантированно существует
  if (clearDoneBtn) {
    clearDoneBtn.disabled = doneTasks === 0;
  }

  if (visibleTasks.length === 0) {
    emptyState.hidden = false;
    taskList.hidden = true;

    const emptyText = emptyState.querySelector("p");
    if (totalTasks === 0) {
      emptyText.textContent = "Список задач пуст. Добавьте первую задачу!";
    } else if (currentFilter === "active") {
      emptyText.textContent = "Нет активных задач. Отличная работа!";
    } else if (currentFilter === "done") {
      emptyText.textContent = "Нет выполненных задач.";
    }
    return;
  } else {
    emptyState.hidden = true;
    taskList.hidden = false;
  }

  taskList.replaceChildren();

  for (const task of visibleTasks) {
    const clone = taskTemplate.content.firstElementChild.cloneNode(true);
    clone.dataset.id = task.id;

    if (task.done) clone.classList.add("task--done");
    if (task.priority === "high") clone.classList.add("task--high");

    const checkInput = clone.querySelector(".task__check");
    checkInput.checked = task.done;
    checkInput.setAttribute("aria-checked", String(task.done));

    clone.querySelector(".task__title").textContent = task.title;

    const badge = clone.querySelector(".badge");
    badge.textContent = getPriorityLabel(task.priority);
    badge.className = `badge badge--${task.priority}`;

    taskList.appendChild(clone);
  }
}

// ==========================================
// 4. ОБРАБОТЧИКИ СОБЫТИЙ
// ==========================================

const taskForm = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const prioritySelect = document.querySelector("#task-priority");
const submitBtn = document.querySelector("#submit-btn");
const filtersContainer = document.querySelector(".filters");

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitBtn.disabled = true;

  const title = titleInput.value;
  const priority = prioritySelect.value;
  const errorMessage = validateTitle(title);

  setFieldError(titleInput, errorMessage);

  if (errorMessage) {
    titleInput.focus();
    submitBtn.disabled = false;
    return;
  }

  addTask(title, priority);

  titleInput.value = "";
  setFieldError(titleInput, "");
  titleInput.focus();
  submitBtn.disabled = false;
});

titleInput.addEventListener("input", () => {
  if (titleInput.closest(".field").classList.contains("field--error")) {
    const errorMessage = validateTitle(titleInput.value);
    setFieldError(titleInput, errorMessage);
  }
});

taskList.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".task__check");
  if (!checkbox) return;
  const taskId = checkbox.closest(".task").dataset.id;
  toggleTask(taskId);
});

taskList.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".task__remove");
  if (!removeBtn) return;
  const taskId = removeBtn.closest(".task").dataset.id;
  removeTask(taskId);
});

filtersContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".filters__button");
  if (!button) return;

  currentFilter = button.dataset.filter;

  filtersContainer.querySelectorAll(".filters__button").forEach((btn) => {
    const isActive = btn === button;
    btn.classList.toggle("filters__button--active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  saveFilter();
  render();
});

clearDoneBtn.addEventListener("click", () => {
  clearDoneTasks();
});

// ==========================================
// 5. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
// ==========================================

tasks = loadTasks();
currentFilter = loadFilter();

if (currentFilter !== "all") {
  filtersContainer.querySelectorAll(".filters__button").forEach((btn) => {
    const isActive = btn.dataset.filter === currentFilter;
    btn.classList.toggle("filters__button--active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

render();
