// 1. ДАННЫЕ И ХРАНИЛИЩЕ
let currentFilter = "all";

// Тестовые данные
let tasks = [
  {
    id: "1",
    title: "Купить молоко и хлеб",
    done: false,
    priority: "normal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Сделать домашнее задание по JS",
    done: false,
    priority: "high",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Позвонить маме",
    done: true,
    priority: "low",
    createdAt: new Date().toISOString(),
  },
];

// 2. ФУНКЦИИ ИЗМЕНЕНИЯ ДАННЫХ

/**
 * Удаляет все выполненные задачи из массива
 */
function clearDoneTasks() {
  tasks = tasks.filter((task) => !task.done);
  render();
}

/**
 * Нормализует название задачи для сравнения
 * (убирает пробелы по краям, приводит к нижнему регистру)
 */
function normalizeTitle(title) {
  return title.trim().toLowerCase();
}

/**
 * Проверяет название задачи на валидность
 */
function validateTitle(title) {
  const trimmed = title.trim();

  if (trimmed === "") {
    return "Введите название задачи";
  }

  if (trimmed.length > 100) {
    return "Название не должно превышать 100 символов";
  }

  // Проверка на дубликат среди невыполненных задач
  const normalized = normalizeTitle(title);
  const isDuplicate = tasks.some(
    (task) => !task.done && normalizeTitle(task.title) === normalized,
  );

  if (isDuplicate) {
    return "Такая задача уже есть";
  }

  return "";
}

/**
 * Устанавливает или снимает ошибку у поля
 */
function setFieldError(control, message) {
  const field = control.closest(".field");
  const hint = field.querySelector(".field__hint");
  const hasError = message !== "";

  field.classList.toggle("field--error", hasError);
  control.setAttribute("aria-invalid", String(hasError));
  if (hint) {
    hint.textContent = message;
  }
}

/**
 * Добавляет новую задачу в массив
 */
function addTask(title, priority) {
  const newTask = {
    id: crypto.randomUUID(),
    title: title.trim(),
    done: false,
    priority: priority,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  render(); // Перерисовываем список
}

/**
 * Переключает статус выполнения задачи
 */
function toggleTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  task.done = !task.done;
  render();
}

/**
 * Удаляет задачу по ID
 */
function removeTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  render();
}

// 3. ОТРИСОВКА (РЕНДЕР)

const taskList = document.querySelector("#task-list");
const taskTemplate = document.querySelector("#task-template");
const emptyState = document.querySelector("#empty-state");
const taskCounter = document.querySelector("#task-counter");

// Вспомогательная функция для текста приоритета
function getPriorityLabel(priority) {
  const labels = {
    low: "Низкий",
    normal: "Обычный",
    high: "Высокий",
  };
  return labels[priority] || priority;
}

function render() {
  // 1. Применяем фильтр (НЕ меняем массив tasks!)
  let visibleTasks;
  if (currentFilter === "active") {
    visibleTasks = tasks.filter((task) => !task.done);
  } else if (currentFilter === "done") {
    visibleTasks = tasks.filter((task) => task.done);
  } else {
    visibleTasks = tasks; // 'all' — показываем все
  }

  // 2. Считаем общую статистику (не зависит от фильтра)
  const totalTasks = tasks.length;
  const remainingTasks = tasks.filter((task) => !task.done).length;
  const doneTasks = totalTasks - remainingTasks;

  // 3. Обновляем счетчик
  taskCounter.textContent = `Осталось: ${remainingTasks} из ${totalTasks}`;

  // 4. Управляем кнопкой "Удалить выполненные"
  clearDoneBtn.disabled = doneTasks === 0;

  // 5. Управляем пустым состоянием
  if (visibleTasks.length === 0) {
    emptyState.hidden = false;
    taskList.hidden = true;

    // Разные сообщения для разных случаев
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

  // 6. Отрисовываем отфильтрованные задачи
  taskList.replaceChildren();

  for (const task of visibleTasks) {
    const clone = taskTemplate.content.firstElementChild.cloneNode(true);
    clone.dataset.id = task.id;

    if (task.done) {
      clone.classList.add("task--done");
    }
    if (task.priority === "high") {
      clone.classList.add("task--high");
    }

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

// 4. ОБРАБОТЧИКИ СОБЫТИЙ

const taskForm = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const prioritySelect = document.querySelector("#task-priority");
const submitBtn = document.querySelector("#submit-btn");

// Обработчик отправки формы
taskForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Отменяем перезагрузку страницы

  // Защита от двойного клика: блокируем кнопку
  submitBtn.disabled = true;

  const title = titleInput.value;
  const priority = prioritySelect.value;
  const errorMessage = validateTitle(title);

  // Устанавливаем ошибку (или очищаем, если сообщение пустое)
  setFieldError(titleInput, errorMessage);

  if (errorMessage) {
    // Если есть ошибка — фокус на поле и разблокируем кнопку
    titleInput.focus();
    submitBtn.disabled = false;
    return;
  }

  // Добавляем задачу
  addTask(title, priority);

  // Очищаем поле и возвращаем фокус
  titleInput.value = "";
  setFieldError(titleInput, ""); // снимаем ошибку на всякий случай
  titleInput.focus();

  // Разблокируем кнопку
  submitBtn.disabled = false;
});

// Live-валидация: снимаем ошибку при вводе
titleInput.addEventListener("input", () => {
  // Если была ошибка — проверяем снова
  if (titleInput.closest(".field").classList.contains("field--error")) {
    const errorMessage = validateTitle(titleInput.value);
    setFieldError(titleInput, errorMessage);
  }
});

// Делегирование: переключение выполнения задачи
taskList.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".task__check");
  if (!checkbox) return;

  const taskElement = checkbox.closest(".task");
  const taskId = taskElement.dataset.id;

  toggleTask(taskId);
});

// Делегирование: удаление задачи
taskList.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".task__remove");
  if (!removeBtn) return;

  const taskElement = removeBtn.closest(".task");
  const taskId = taskElement.dataset.id;

  removeTask(taskId);
});

const filtersContainer = document.querySelector(".filters");
const clearDoneBtn = document.getElementById("clear-done-btn");

// Делегирование: переключение фильтров
filtersContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".filters__button");
  if (!button) return;

  const filter = button.dataset.filter;
  currentFilter = filter;

  // Обновляем активную кнопку
  filtersContainer.querySelectorAll(".filters__button").forEach((btn) => {
    const isActive = btn === button;
    btn.classList.toggle("filters__button--active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  render();
});

// Обработчик кнопки "Удалить выполненные"
clearDoneBtn.addEventListener("click", () => {
  clearDoneTasks();
});

// Первичная отрисовка при загрузке страницы
render();
