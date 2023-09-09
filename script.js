const inputDisplay = document.querySelector(".inputDisplay");
const resultDisplay = document.querySelector(".resultDisplay");
const buttons = document.querySelectorAll(".btn");
const equalsBtn = document.querySelector('[data-operator="="]');
const acBtn = document.querySelector('[data-fn="ac"]');
const calcOperators = document.querySelectorAll(
  '[data-operator]:not([data-operator="="])'
);
const deleteBtn = document.querySelector('[data-fn="delete"]');

let firstNumber = undefined;
let secondNumber = undefined;
let operator = undefined;
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

  //if the user clicks on the percentage sign and there is a number in the display calculate the percentage and display it in the input display
  // if (value === "%" && currentInput) {
  //   const percentage = operate(value, +currentInput);
  //   inputDisplay.textContent = percentage;
  //   currentInput = percentage;
  //   operator = null;
  //   return;
  // }

  // prevent displaying equal sign 
  if (value === "=") return;

  // Prevent displaying multiple operators
  if (operatorRegex.test(value) && operatorRegex.test(currentInput.slice(-2))) return;


  // Clear the display if the previous result is displayed
  if (resultDisplay.textContent && value !== "=" && !operatorRegex.test(value)) {
    clearDisplay();
  }

  // Display the previous result as the first number if user clicks on a operator
  if (resultDisplay.textContent && operatorRegex.test(value)) {
    inputDisplay.textContent = resultDisplay.textContent.replace("= ", "");
    resultDisplay.textContent = "";
    currentInput = inputDisplay.textContent;
    nullifyValues();
  }

  // Prevent displaying multiple zeros
  if (value === "0" && !currentInput) return;
  
  // Prevent displaying operator as first input
  if(operatorRegex.test(value) && !currentInput) return

  // Prevent multiple decimals
  if (value === "." && currentInput.includes(".")) return;

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

function nullifyValues() {
  firstNumber = null;
  secondNumber = null;
  operator = null;
}

function deleteLast() {
  if (!currentInput) return;
  if (resultDisplay.textContent) {
    inputDisplay.textContent = resultDisplay.textContent.replace("= ", "");
    resultDisplay.textContent = "";
    currentInput = inputDisplay.textContent;
    nullifyValues();
    return
  }
  const lastChar = currentInput.trimEnd().slice(-1);

  currentInput = currentInput.trimEnd().slice(0, -1);
 
  inputDisplay.textContent = currentInput;

  if (operatorRegex.test(lastChar)) {
    operator = null;
  }
}

function setOperator(e) {
  if (!currentInput) return;
  if (operator) return;
  operator = e.target.dataset.operator;
}

function calculate() {
  if(resultDisplay.textContent) return console.log("cal ran");
  if (!operator) return;

  const numbers = currentInput.split(operatorRegex).map((num) => {
    // Check if the 'num' is empty or contains only whitespace
    if (num.trim() === "") {
      return 1; // Replace empty or whitespace with 1
    } else {
      return +num; // Convert the other values to numbers
    }
  });
  
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
