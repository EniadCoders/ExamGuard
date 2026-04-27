const assert = require('assert');

// simulate React state
let answers = {};
let current = 0;

function setAnswers(updater) {
  answers = updater(answers);
}

function setAnswer(val) {
  setAnswers((prev) => ({ ...prev, [current]: val }));
}

setAnswer("A");
console.log("Answers:", answers);
console.log("Is Answered:", typeof answers[current] === "string" && answers[current].length > 0);
console.log("Sel (for A):", answers[current] === "A");
console.log("Sel (for B):", answers[current] === "B");
