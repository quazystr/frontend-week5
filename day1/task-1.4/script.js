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

console.log(
  isEmpty(""),
  isEmpty(" "),
  isEmpty("a"),
  isEmpty("a@b"),
  isEmpty("a@b."),
  isEmpty(" name@example.com "),
  isEmpty("имя@почта.рф"),
  isEmpty("a@@b.ru"),
);

console.log(
  isValidName(""),
  isValidName(" "),
  isValidName("a"),
  isValidName("a@b"),
  isValidName("a@b."),
  isValidName(" name@example.com "),
  isValidName("имя@почта.рф"),
  isValidName("a@@b.ru"),
);

console.log(
  isEmail(""),
  isEmail(" "),
  isEmail("a"),
  isEmail("a@b"),
  isEmail("a@b."),
  isEmail(" name@example.com "),
  isEmail("имя@почта.рф"),
  isEmail("a@@b.ru"),
);
