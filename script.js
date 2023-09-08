const inputDisplay = document.querySelector(".inputDisplay");
const resultDisplay = document.querySelector(".resultDisplay");
const buttons = document.querySelectorAll(".btn");
const equalsBtn = document.querySelector('[data-operator="="]');
const acBtn = document.querySelector('[data-fn="ac"]');
const calcOperators = document.querySelectorAll(
  '[data-operator]:not([data-operator="="])'
);
const deleteBtn = document.querySelector('[data-fn="delete"]');

let firstNumber = null;
let secondNumber = null;
let operator = null;
let currentInput = "";
const operatorRegex = /[+\-x÷%]/;

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) return "Can't divide by 0";
  return a / b;
}

function percentage(a) {
  return a / 100;
}

function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "x":
      return multiply(a, b);
    case "÷":
      return divide(a, b);
    case "%":
      return percentage(a);
  }
}

function updateDisplay(e) {
  const value = e.target.dataset.num || e.target.dataset.operator;
  if (!value) return;

  // if(value === '%') return 
  if (value === '=') {
    if (!firstNumber || !operator) return;
  }

  // Add a space before and after operators
  if (operatorRegex.test(value)) {
    currentInput += ` ${value} `;
  } else {
    currentInput += value;
  }

  // Display the current input with spaces
  inputDisplay.textContent = currentInput;
}


function clearDisplay() {
  inputDisplay.textContent = "";
  resultDisplay.textContent = "";
  firstNumber = null;
  secondNumber = null;
  operator = null;
  currentInput = "";
}

function deleteLast() {
  if (!currentInput) return;
  const lastChar = currentInput.trimEnd().slice(-1);

  currentInput = currentInput.trimEnd().slice(0, -1);
 
  inputDisplay.textContent = currentInput;

  if (operatorRegex.test(lastChar)) {
    operator = null;
  }
}

function setOperator(e) {
  operator = e.target.dataset.operator;
}

function calculate() {
  if (!operator) return;

  const numbers = currentInput.split(operatorRegex).map((num) => +num);
  console.log(numbers);
  firstNumber = numbers[0];
  secondNumber = numbers[1];

  const result = operate(operator, firstNumber, secondNumber);
  resultDisplay.textContent = `= ${result}`
}


buttons.forEach((button) => button.addEventListener("click", updateDisplay));

acBtn.addEventListener("click", clearDisplay);

calcOperators.forEach((operator) =>
  operator.addEventListener("click", setOperator)
);

deleteBtn.addEventListener("click", deleteLast);

equalsBtn.addEventListener("click", calculate);
