function updateCounter(textarea) {
  const field = textarea.closest(".field");
  const hint = field.querySelector(".field__hint");
  const maxLength = Number(textarea.dataset.maxlength);
  const currentLength = textarea.value.length;

  hint.textContent = `${currentLength} / ${maxLength}`;

  const WARNING_THRESHOLD = 180;
  field.classList.toggle("field--warning", currentLength >= WARNING_THRESHOLD);
}

const commentField = document.querySelector("#comment");
commentField.addEventListener("input", () => {
  updateCounter(commentField);
});

updateCounter(commentField);
