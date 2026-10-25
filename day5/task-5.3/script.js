let favoriteIds = [];
let showOnlyFavorites = false;
let searchQuery = "";
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
];
const list = document.querySelector(".card-list");
const searchInput = document.querySelector("#search-input");
const template = document.querySelector("#product-template");
const countElement = document.querySelector("#products-count");
const emptyState = document.querySelector("#empty-state");
const favoritesCounter = document.querySelector("#favorites-counter");
const onlyFavoritesToggle = document.querySelector("#only-favorites-toggle");

function loadFavorites() {
  try {
    const raw = localStorage.getItem("favorites");

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((id) => {
      if (typeof id !== "number") return false;

      if (!Number.isInteger(id)) return false;

      return products.some((product) => product.id === id);
    });
  } catch (error) {
    console.warn("Не удалось загрузить избранное из localStorage:", error);
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favoriteIds));
}

function isFavorite(productId) {
  return favoriteIds.includes(productId);
}

function toggleFavorite(productId) {
  if (isFavorite(productId)) {
    favoriteIds = favoriteIds.filter((id) => id !== productId);
  } else {
    favoriteIds.push(productId);
  }

  saveFavorites();
  renderFavoritesCounter();
  renderProducts();
}

function renderFavoritesCounter() {
  favoritesCounter.textContent = `Избранное: ${favoriteIds.length}`;
}

function renderProducts() {
  let filteredProducts = showOnlyFavorites
    ? products.filter((product) => isFavorite(product.id))
    : products;

  if (searchQuery.trim() !== "") {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(normalizedQuery),
    );
  }

  countElement.textContent = `Показано: ${filteredProducts.length} из ${products.length}`;

  if (filteredProducts.length === 0) {
    list.hidden = true;
    emptyState.hidden = false;

    const emptyText = emptyState.querySelector("p");

    if (searchQuery.trim() !== "") {
      emptyText.textContent = "";
      emptyText.textContent = `Ничего не найдено по запросу «${searchQuery.trim()}»`;
    } else if (showOnlyFavorites) {
      emptyText.textContent = "В избранном нет товаров";
    } else {
      emptyText.textContent = "Товаров нет";
    }

    return;
  } else {
    list.hidden = false;
    emptyState.hidden = true;
  }

  list.replaceChildren();

  for (const product of filteredProducts) {
    const card = template.content.firstElementChild.cloneNode(true);

    card.dataset.id = product.id;

    if (isFavorite(product.id)) {
      card.classList.add("card--favorite");
    }

    card.querySelector(".card__title").textContent = product.title;
    card.querySelector(".card__text").textContent = `${product.price} руб.`;

    const cartBtn = card.querySelector(".card__btn");
    if (cartBtn) {
      if (!product.inStock) {
        card.classList.add("card--disabled");
        cartBtn.textContent = "Нет в наличии";
        cartBtn.disabled = true;
      } else {
        cartBtn.textContent = "В корзину";
        cartBtn.disabled = false;
      }
    }

    const favoriteBtn = card.querySelector(".card__favorite-btn");
    if (favoriteBtn) {
      const isFav = isFavorite(product.id);
      favoriteBtn.setAttribute("aria-pressed", String(isFav));
      favoriteBtn.setAttribute(
        "aria-label",
        isFav ? "Убрать из избранного" : "Добавить в избранное",
      );
    }

    list.append(card);
  }
}

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  renderProducts();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searchInput.value = "";
    searchQuery = "";
    renderProducts();
    searchInput.blur();
  }
});

list.addEventListener("click", (event) => {
  const favoriteBtn = event.target.closest(".card__favorite-btn");

  if (favoriteBtn) {
    const card = favoriteBtn.closest(".card");
    const productId = Number(card.dataset.id);
    toggleFavorite(productId);
    return;
  }

  const cartBtn = event.target.closest(".card__btn");
  if (cartBtn && !cartBtn.disabled) {
    const card = cartBtn.closest(".card");
    const productId = Number(card.dataset.id);
    console.log("Добавить в корзину:", productId);
  }
});

onlyFavoritesToggle.addEventListener("change", (event) => {
  showOnlyFavorites = event.target.checked;
  renderProducts();
});

favoriteIds = loadFavorites();
renderFavoritesCounter();
renderProducts();
