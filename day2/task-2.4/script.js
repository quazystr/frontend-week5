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

function getAvaliableProducts(products) {
  return products.filter((product) => product.inStock);
}

function getByCategory(products, category) {
  return products.filter((product) => product.category === category);
}

function getTitles(products) {
  return products.map((product) => product.title);
}

function findById(products, id) {
  return products.find((product) => product.id === id) ?? null;
}

function getTotal(products) {
  const avaliable = (getAvaliableProducts = products);
  return avaliable.reduce((sum, product) => sum + product.price, 0);
}

function getAverageRating(products) {
  const sum = products.reduce((sum, product) => sum + product.rating, 0);
  const average =
    products.length > 0 ? Number((sum / products.length).toFixed(1)) : 0;
  return average;
}

function countByCategory(products) {
  return products.reduce((sum, product) => {
    const cat = product.category;
    sum[cat] = (sum[cat] ?? 0) + 1;
    return sum;
  }, {});
}

function sortByPrice(products, direction) {
  return [...products].sort((a, b) => {
    if (direction === "desc") {
      return b.price - a.price;
    }
    return a.price - b.price;
  });
}

function updatePrice(products, id, newPrice) {
  return products.map((product) =>
    product.id === id ? { ...product, price: newPrice } : product,
  );
}

function removeById(products, id) {
  if (id === undefined) {
    console.warn("ID не указан!");
    return products;
  }
  return products.filter((product) => product.id !== id);
}

console.log(updatePrice(products, 3, 7000));

console.log(removeById(products, 1));
console.log(removeById(products));

console.log(products);
