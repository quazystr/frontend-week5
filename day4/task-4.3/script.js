let tags = [];

const form = document.querySelector(".tag-form");
const input = form.querySelector("#tag-input");
const tagList = document.querySelector(".tag-list");

function normalizeTag(tag) {
  return tag.trim().toLowerCase();
}

function validateTag(tag) {
  const trimmed = tag.trim();

  if (trimmed === "") {
    return "Тег не может быть пустым";
  }

  const normalized = normalizeTag(tag);
  const isDuplicate = tags.some((t) => normalizeTag(t) === normalized);

  if (isDuplicate) {
    return "Такой тег уже есть";
  }

  return "";
}

function setError(control, message) {
  const field = control.closest(".field");
  const hint = field.querySelector(".field__hint");
  const hasError = message !== "";

  field.classList.toggle("field--error", hasError);
  control.setAttribute("aria-invalid", String(hasError));
  hint.textContent = message;
}

function renderTags() {
  tagList.replaceChildren();

  tags.forEach((tag) => {
    const li = document.createElement("li");
    li.className = "tag-list__item";

    const textSpan = document.createElement("span");
    textSpan.className = "tag-list__text";
    textSpan.textContent = tag;

    const removeBtn = document.createElement("button");
    removeBtn.className = "tag-list__remove";
    removeBtn.type = "button";
    removeBtn.textContent = "x";
    removeBtn.setAttribute("aria-label", `Удалить тег ${tag}`);

    li.appendChild(textSpan);
    li.appendChild(removeBtn);
    tagList.appendChild(li);
  });
}

function addTag() {
  const tag = input.value;
  const errorMessage = validateTag(tag);

  setError(input, errorMessage);

  if (errorMessage) {
    input.focus();
    return;
  }

  tags.push(tag.trim());
  renderTags();

  input.value = "";
  setError(input, "");
  input.focus();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTag();
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTag();
  }
});

tagList.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".tag-list__remove");

  if (!removeBtn) return;

  const tagItem = removeBtn.closest(".tag-list__item");

  const tagText = tagItem.querySelector(".tag-list__text").textContent;

  tags = tags.filter((t) => t !== tagText);

  renderTags();
});

input.addEventListener("input", () => {
  if (input.closest(".field").classList.contains("field--error")) {
    const errorMessage = validateTag(input.value);
    setError(input, errorMessage);
  }
});
