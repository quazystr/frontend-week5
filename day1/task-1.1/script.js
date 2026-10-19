let name = "John";
let age = 22;
let isStudent = true;
let emptyValue = null;
let score;
let courses = ["Frontend", "DevOps", "Backend"];
let student = {
  name: name,
  age: age,
  courses: courses[0],
};

function greet() {
  console.log("Hello!");
}

console.log("Имя:", name, "Тип:", typeof name);
console.log("Возраст:", age, "Тип:", typeof age);
console.log("Булевое значение:", isStudent, "Тип:", typeof isStudent);
console.log("Пустое значение:", emptyValue, "Тип:", typeof emptyValue);
console.log("Незаданное значение:", score, "Тип:", typeof score);
console.log("Массив:", courses, "Тип:", typeof courses);
console.log("Объект:", student, "Тип:", typeof student);
console.log("Функция:", greet, "Тип:", typeof greet);
