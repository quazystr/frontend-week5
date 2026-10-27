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

// Пока пусто

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

// Первичная отрисовка при загрузке страницы
render();
