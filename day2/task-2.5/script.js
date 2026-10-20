const a = { title: "Мышь", tags: ["input"] };
const b = a;
const c = { ...a };
b.title = "Клавиатура";
c.tags.push("usb");
console.log(a.title, a.tags.length);
