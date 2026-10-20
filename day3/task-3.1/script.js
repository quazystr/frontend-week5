const cardData = {
  title: "<b>Карта товара</b>",
  text: "Телефон",
  link: "Подробнее",
};

function renderCardData(data) {
  const card = document.querySelector(".card");
  const titleEl = card.querySelector(".card__title");
  const textEl = card.querySelector(".card__text");
  const linkEl = card.querySelector(".card__link");

  titleEl.textContent = data.title;
  textEl.textContent = data.text;
  linkEl.textContent = data.link;
  linkEl.setAttribute("href", "#");
}

renderCardData(cardData);
