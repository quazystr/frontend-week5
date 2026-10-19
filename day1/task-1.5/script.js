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

console.log(
  getGrade(0),
  getGrade(59),
  getGrade(60),
  getGrade(74),
  getGrade(89),
  getGrade(90),
  getGrade(100),
  getGrade(-1),
  getGrade(101),
  getGrade(74.5),
  getGrade("80"),
  getGrade("abc"),
  getGrade(null),
);
