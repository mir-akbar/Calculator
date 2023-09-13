const inputDisplay = document.querySelector(".inputDisplay");
const resultDisplay = document.querySelector(".resultDisplay");
const buttons = document.querySelectorAll(".btn");
const equalsBtn = document.querySelector('[data-operator="="]');
const acBtn = document.querySelector('[data-fn="ac"]');
const backspaceBtn = document.querySelector('[data-fn="backspace"]');
const operatorRegex = /[+\-x÷%]/;
const errorMessage = "Can't divide by 0";
const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '%', '.', '=', 'Enter', 'Backspace', 'Delete', 'Escape' ];
const keyToButton = {
  'Enter': '[data-operator="="]',
  'Backspace': '[data-fn="backspace"]',
  'Delete': '[data-fn="ac"]',
  'Escape': '[data-fn="ac"]',
  '+': '[data-operator="+"]',
  '-': '[data-operator="-"]',
  '*': '[data-operator="x"]',
  '/': '[data-operator="÷"]',
  '%': '[data-operator="%"]',
};


let firstNumber = undefined;
let secondNumber = undefined;
let operator = undefined;
let currentInput = "";

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

  // Calculate left to right if the input is more than 2 number and an operator is clicked
  if (isOperator(value) && currentInput.length >= 5 && operator) {
    handleInlineCalculation(value);
    return;
  }

  // Setting the operator
  if (isOperator(value)) {
    setOperator(value);
  }

  // Prevent displaying multiple operators
  if (isOperator(value) && isOperator(currentInput.slice(-2))) return;

  //Handle percentage calculation
  if (value === "%" && currentInput) {
    handlePercentage(value);
    return;
  }

  // prevent displaying equal sign
  if (value === "=") return;

  // Clear the display if the previous result is displayed
  if (resultDisplay.textContent && value !== "=" && !isOperator(value)) {
    clearDisplay();
  }

  // Set result as the first number if user clicks on a operator after the result is displayed
  if (resultDisplay.textContent && isOperator(value)) {
    setResultAsFirstNum(value);
  }

  // Prevent displaying multiple zeros
  if (value === "0" && !currentInput) return;

  // Prevent displaying operator as first input
  if (isOperator(value) && !currentInput) return;

  // Prevent multiple decimals values
  if (value === "." && currentInput.includes(".")) return;

  // Add a space before and after operators
  if (isOperator(value)) {
    currentInput += ` ${value} `;
  } else {
    currentInput += value;
  }

  // Display the current input with spaces
  updateInputDisplay(currentInput);
}

function updateInputDisplay(text) {
  inputDisplay.textContent = text;
}

function clearResultDisplay() {
  resultDisplay.textContent = "";
}

function clearDisplay() {
  inputDisplay.textContent = "";
  resultDisplay.textContent = "";
  nullifyAllValues();
}

function nullifyValues() {
  firstNumber = undefined;
  secondNumber = undefined;
  operator = undefined;
}

function nullifyAllValues() {
  nullifyValues();
  currentInput = "";
}

function handlePercentage(value) {
  if (resultDisplay.textContent) {
    clearResultDisplay();
  }
  const percentage = operate(value, parseFloat(currentInput));
  inputDisplay.textContent = percentage;
  currentInput = percentage.toString();
  nullifyValues();
}

function setResultAsFirstNum(value) {
  if (resultDisplay.textContent === "= Can't divide by 0") return;
  else {
    inputDisplay.textContent = resultDisplay.textContent.replace("=", "");
    clearResultDisplay();
    currentInput = inputDisplay.textContent;
    nullifyValues();
    operator = value;
  }
}

function handleInlineCalculation(value) {
  const result = calculateInline();
  if (result === errorMessage) {
    resultDisplay.textContent = `= ${result}`;
    nullifyAllValues();
    return;
  }
  currentInput = `${result} ${value} `;
  inputDisplay.textContent = `${result} ${value}`;
  nullifyValues();
  operator = value;
}

function deleteLast() {
  if (!currentInput) return;
  if (resultDisplay.textContent) {
    inputDisplay.textContent = resultDisplay.textContent.replace("= ", "");
    clearResultDisplay();
    currentInput = inputDisplay.textContent;
    nullifyValues();
    return;
  }
  const lastChar = currentInput.trimEnd().slice(-1);

  currentInput = currentInput.trimEnd().slice(0, -1);

  updateInputDisplay(currentInput);

  if (isOperator(lastChar)) {
    operator = undefined;
  }
}

function setOperator(value) {
  if (!currentInput) return;
  operator = value;
}

function isOperator(value) {
  return operatorRegex.test(value);
}

function calculate() {
  if (resultDisplay.textContent) return;
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
  const roundedResult = +result.toFixed(10);
  resultDisplay.textContent = `= ${roundedResult}`;
  if (result === "Can't divide by 0") return nullifyAllValues();
  currentInput = result.toString();
  nullifyValues();
}

function calculateInline() {
  const inLineNumbers = currentInput.split(operatorRegex).map((num) => +num);
  firstNumber = inLineNumbers[0];
  secondNumber = inLineNumbers[1];

  return operate(operator, firstNumber, secondNumber);
}

function handleKeyboardInput(key) {
  // Check if the pressed key is allowed
  if (allowedKeys.includes(key)) {
    // Find the corresponding button element and trigger a click event
    const button = findButtonByKeyboardKey(key);
    if (button) {
      button.click();
    }
  }
}

function findButtonByKeyboardKey(key) {
  // Check if the key corresponds to a button attribute
  if (keyToButton[key]) {
    return document.querySelector(keyToButton[key]);
  }

  // Check if the key is a digit or decimal point
  if (/^[0-9.]$/.test(key)) {
    return document.querySelector(`[data-num="${key}"]`);
  }

  return null;
}


// Add an event listener to the document for the 'keydown' event
document.addEventListener('keydown', (event) => {
  handleKeyboardInput(event.key);
});

buttons.forEach((button) => button.addEventListener("click", updateDisplay));
acBtn.addEventListener("click", clearDisplay);
backspaceBtn.addEventListener("click", deleteLast);
equalsBtn.addEventListener("click", calculate);