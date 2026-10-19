function getGrade(score) {
  const parsedScore = Number(score);

  if (Number.isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
    return "некорректный балл";
  }

  if (parsedScore >= 90 && parsedScore <= 100) {
    return "отлично";
  }
  if (parsedScore >= 75 && parsedScore <= 89) {
    return "хорошо";
  }
  if (parsedScore >= 60 && parsedScore <= 74) {
    return "удовлетворительно";
  }
  if (parsedScore >= 0 && parsedScore <= 59) {
    return "не сдано";
  }

  return "некорректный балл";
}

console.log(getGrade(0));
console.log(getGrade(59));
console.log(getGrade(60));
console.log(getGrade(74));
console.log(getGrade(89));
console.log(getGrade(90));
console.log(getGrade(100));
console.log(getGrade(-1));
console.log(getGrade(101));
console.log(getGrade(74.5));
console.log(getGrade("80"));
console.log(getGrade("abc"));
console.log(getGrade(null));
