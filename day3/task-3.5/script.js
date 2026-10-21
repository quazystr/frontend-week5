const list = document.querySelector(".card-list");
const template = document.querySelector("#product-template");
const countElement = document.querySelector("#products-count");
const emptyState = document.querySelector("#empty-state");

const products = [
  {
    id: 1,
    title: "Беспроводные наушники",
    category: "audio",
    price: 4990,
    inStock: true,
    rating: 5,
  },
  {
    id: 2,
    title: "Портативная колонка",
    category: "audio",
    price: 2990,
    inStock: true,
    rating: 4,
  },
  {
    id: 3,
    title: "Игровая гарнитура",
    category: "audio",
    price: 7500,
    inStock: false,
    rating: 5,
  },

  {
    id: 4,
    title: "Механическая клавиатура",
    category: "input",
    price: 5490,
    inStock: true,
    rating: 5,
  },
  {
    id: 5,
    title: "Игровая мышь",
    category: "input",
    price: 2490,
    inStock: true,
    rating: 4,
  },
  {
    id: 6,
    title: "Графический планшет",
    category: "input",
    price: 8990,
    inStock: false,
    rating: 3,
  },

  {
    id: 7,
    title: "Монитор 27 дюймов",
    category: "display",
    price: 18990,
    inStock: true,
    rating: 5,
  },
  {
    id: 8,
    title: "Портативный монитор",
    category: "display",
    price: 12490,
    inStock: true,
    rating: 4,
  },
  {
    id: 9,
    title:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis.",
    category: "display",
    price: 1234567,
    inStock: true,
    rating: 3,
  },
];

function renderProducts(products) {
  countElement.textContent = `Показано: ${products.length} из ${products.length}`;

  if (products.length === 0) {
    list.hidden = true;
    emptyState.hidden = false;
    return;
  } else {
    list.hidden = false;
    emptyState.hidden = true;
  }

  list.replaceChildren();
  countElement.textContent = `Показано: ${products.length} из ${products.length}`;
  for (const product of products) {
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.id = product.id;
    card.querySelector(".card__title").textContent = product.title;
    card.querySelector(".card__text").textContent =
      `${product.price.toLocaleString("ru-RU")} руб.`;
    const btn = card.querySelector(".card__btn");
    if (!product.inStock) {
      card.classList.add("card--disabled");
      btn.textContent = "Нет в наличии";
      btn.disabled = true;
    } else {
      btn.disabled = false;
    }

    list.append(card);
  }
}

renderProducts(products);
