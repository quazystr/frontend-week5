// 1. ДАННЫЕ И ХРАНИЛИЩЕ

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
  // 1. Очищаем список перед новой отрисовкой
  taskList.replaceChildren();

  // 2. Считаем статистику
  const totalTasks = tasks.length;
  const remainingTasks = tasks.filter((task) => !task.done).length;

  // 3. Обновляем счетчик
  taskCounter.textContent = `Осталось: ${remainingTasks} из ${totalTasks}`;

  // 4. Управляем пустым состоянием
  if (totalTasks === 0) {
    emptyState.hidden = false;
    taskList.hidden = true; // Скрываем сам список, если он пуст
    return; // Прерываем функцию, задачи рисовать не нужно
  } else {
    emptyState.hidden = true;
    taskList.hidden = false;
  }

  // 5. Отрисовываем задачи
  for (const task of tasks) {
    // Клонируем содержимое шаблона (первый элемент внутри template - это <li>)
    const clone = taskTemplate.content.firstElementChild.cloneNode(true);

    // Сохраняем ID в data-атрибуте (пригодится для делегирования событий позже)
    clone.dataset.id = task.id;

    // Применяем модификаторы состояния
    if (task.done) {
      clone.classList.add("task--done");
    }
    if (task.priority === "high") {
      clone.classList.add("task--high");
    }

    // Заполняем содержимое
    const checkInput = clone.querySelector(".task__check");
    checkInput.checked = task.done;
    // Для доступности (скринридеры)
    checkInput.setAttribute("aria-checked", String(task.done));

    clone.querySelector(".task__title").textContent = task.title;

    // Настраиваем бейдж приоритета
    const badge = clone.querySelector(".badge");
    badge.textContent = getPriorityLabel(task.priority);
    // Сбрасываем классы и добавляем базовый + модификатор
    badge.className = `badge badge--${task.priority}`;

    // Добавляем готовый элемент в список
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

// Первичная отрисовка при загрузке страницы
render();
