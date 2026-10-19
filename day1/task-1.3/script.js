function formatPrice(value, currency = "руб") {
  const amount = Number(value);
  if (Number.isNaN(amount) || amount < 0 || value === "" || value === null) {
    return "Цена не указана";
  }
  return `${amount.toLocaleString("ru-RU")} ${currency}`;
}

console.log(formatPrice(""));
console.log(formatPrice(null));
console.log(formatPrice(undefined));
console.log(formatPrice(-5));
console.log(formatPrice("1e3"));
console.log(formatPrice(0));
console.log(formatPrice(1234567));
