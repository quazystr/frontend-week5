function isEmpty(text) {
  if (text.trim() === "") {
    return true;
  }
  return false;
}

function isValidName(text) {
  if (typeof text !== "string") {
    return false;
  }
  const trimmedName = text.trim();
  return trimmedName.length >= 2 && trimmedName.length <= 40;
}

function isEmail(text) {
  if (typeof text !== "string") {
    return false;
  }
  const trimmedEmail = text.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmedEmail);
}

console.log(isEmpty(""));
console.log(isEmpty(" "));
console.log(isEmpty("a"));
console.log(isEmpty("a@b"));
console.log(isEmpty("a@b."));
console.log(isEmpty(" name@example.com "));
console.log(isEmpty("имя@почта.рф"));
console.log(isEmpty("a@@b.ru"));

console.log(isValidName(""));
console.log(isValidName(" "));
console.log(isValidName("a"));
console.log(isValidName("a@b"));
console.log(isValidName("a@b."));
console.log(isValidName(" name@example.com "));
console.log(isValidName("имя@почта.рф"));
console.log(isValidName("a@@b.ru"));

console.log(isEmail(""));
console.log(isEmail(" "));
console.log(isEmail("a"));
console.log(isEmail("a@b"));
console.log(isEmail("a@b."));
console.log(isEmail(" name@example.com "));
console.log(isEmail("имя@почта.рф"));
console.log(isEmail("a@@b.ru"));
