const form = document.querySelector("#course-form");
const successAlert = document.querySelector("#success-alert");
const successMessage = document.querySelector("#success-message");
const resetFormBtn = document.querySelector("#reset-form-btn");

const isValidName = (value) => {
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 40;
};

const isEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

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

function clearAllErrors() {
  form.querySelectorAll(".field--error").forEach((field) => {
    field.classList.remove("field--error");
  });
  form.querySelectorAll('[aria-invalid="true"]').forEach((control) => {
    control.setAttribute("aria-invalid", "false");
  });
  form.querySelectorAll(".field__hint").forEach((hint) => {
    if (!hint.textContent.includes("Промокод")) {
      hint.textContent = "";
    }
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearAllErrors();

  const elements = form.elements;
  let firstErrorControl = null;

  if (!isValidName(elements.name.value)) {
    setFieldError(elements.name, "Имя: от 2 до 40 символов");
    if (!firstErrorControl) firstErrorControl = elements.name;
  }

  if (!isEmail(elements.email.value)) {
    setFieldError(elements.email, "Введите email в формате name@example.com");
    if (!firstErrorControl) firstErrorControl = elements.email;
  }

  if (!elements.direction.value) {
    setFieldError(elements.direction, "Выберите направление");
    if (!firstErrorControl) firstErrorControl = elements.direction;
  }

  if (!elements.consent.checked) {
    setFieldError(elements.consent, "Необходимо дать согласие");
    if (!firstErrorControl) firstErrorControl = elements.consent;
  }

  if (firstErrorControl) {
    firstErrorControl.focus();
    return;
  }

  const userName = elements.name.value.trim();

  form.hidden = true;
  successAlert.hidden = false;

  successMessage.textContent = `Заявка принята, ${userName}! Мы свяжемся с вами.`;
});

form.addEventListener("input", (event) => {
  const control = event.target;

  if (control.matches('input[type="text"], input[type="email"], textarea')) {
    const field = control.closest(".field");
    if (field.classList.contains("field--error")) {
      let isValid = false;
      if (control.name === "name") isValid = isValidName(control.value);
      if (control.name === "email") isValid = isEmail(control.value);

      if (isValid) {
        setFieldError(control, "");
      }
    }
  }
});

form.addEventListener("change", (event) => {
  const control = event.target;

  if (control.matches('select, input[type="checkbox"]')) {
    const field = control.closest(".field");
    if (field.classList.contains("field--error")) {
      let isValid = false;
      if (control.name === "direction") isValid = control.value !== "";
      if (control.name === "consent") isValid = control.checked;

      if (isValid) {
        setFieldError(control, "");
      }
    }
  }
});

resetFormBtn.addEventListener("click", () => {
  form.reset();
  clearAllErrors();

  successAlert.hidden = true;
  form.hidden = false;
});
