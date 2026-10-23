const MIN = 0;
const MAX = 10;
let count = 0;

const counter = document.querySelector(".counter");
const valueEl = counter.querySelector(".counter__value");
const decreaseBtn = counter.querySelector('[data-action="decrease"]');
const increaseBtn = counter.querySelector('[data-action="increase"]');
const resetBtn = counter.querySelector('[data-action="reset"]');

function render() {
  valueEl.textContent = count;

  valueEl.classList.toggle("counter__value--max", count === MAX);

  decreaseBtn.disabled = count === MIN;
  increaseBtn.disabled = count === MAX;
}

counter.addEventListener("click", (event) => {
  const button = event.target.closest(".counter__button");
  if (!button) return;

  const action = button.dataset.action;

  if (action === "decrease" && count > MIN) {
    count--;
  } else if (action === "increase" && count < MAX) {
    count++;
  } else if (action === "reset") {
    count = 0;
  }

  render();
});

render();
