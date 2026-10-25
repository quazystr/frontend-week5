const themeToggleBtn = document.querySelector("#theme-toggle");
const body = document.querySelector(".page");

function applyTheme(isDark) {
  if (isDark) {
    body.classList.add("page--dark");
    themeToggleBtn.setAttribute("aria-pressed", "true");
    themeToggleBtn.textContent = "Светлая тема";
  } else {
    body.classList.remove("page--dark");
    themeToggleBtn.setAttribute("aria-pressed", "false");
    themeToggleBtn.textContent = "Темная тема";
  }
}

const savedTheme = localStorage.getItem("theme");

const isDarkTheme = savedTheme === "dark";

applyTheme(isDarkTheme);

themeToggleBtn.addEventListener("click", () => {
  const isCurrentlyDark = body.classList.contains("page--dark");
  const newIsDark = !isCurrentlyDark;

  applyTheme(newIsDark);

  if (newIsDark) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.removeItem("theme");
  }
});
