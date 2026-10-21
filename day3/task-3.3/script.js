const alert = document.querySelector(".alert");
const button = document.querySelector(".button");
const btnSuccess = document.querySelector("#btn-success");
const btnDanger = document.querySelector("#btn-danger");
const btnHide = document.querySelector("#btn-hide");

function renderAlert(type, title, text) {
  alert.hidden = false;
  alert.classList.remove("alert--success", "alert--danger");
  if (type === "success") {
    alert.classList.add("alert--success");
  } else if (type === "danger") {
    alert.classList.add("alert--danger");
  }

  alert.querySelector(".alert__title").textContent = title;
  alert.querySelector(".alert__text").textContent = text;
}

btnSuccess.addEventListener("click", () => {
  renderAlert("success", "Готово!", "Операция прошла успешно");
});

btnDanger.addEventListener("click", () => {
  renderAlert("danger", "Ошибка!", "Что-то пошло не так..");
});

btnHide.addEventListener("click", () => {
  alert.hidden = true;
});
