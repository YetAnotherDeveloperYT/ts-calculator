document.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    try {
      navigator.serviceWorker
        .register("/serviceWorker.js", { scope: "/" })
        .then(() => {});
    } catch (e) {
      console.log("Service Worker Registration Failed");
      console.log(e);
    }
  }
});

const clearIcon = `<svg x="0px" y="0px" viewBox="0 0 44.18 44.18" fill="currentColor"><path d="M10.625,5.09L0,22.09l10.625,17H44.18v-34H10.625z M42.18,37.09H11.734l-9.375-15l9.375-15H42.18V37.09z"/><polygon points="18.887,30.797 26.18,23.504 33.473,30.797 34.887,29.383 27.594,22.09 34.887,14.797 33.473,13.383 26.18,20.676 18.887,13.383 17.473,14.797 24.766,22.09 17.473,29.383"/></svg>`;

const specialBtn = [0, 1, 2, 3, 19];
const numpadMap: { value: string; exec: any }[] = [
  { value: "C", exec: clearAll },
  { value: clearIcon, exec: clearOne },
  { value: "(", exec: openBracket },
  { value: ")", exec: closeBracket },
  { value: "7", exec: addNumber },
  { value: "8", exec: addNumber },
  { value: "9", exec: addNumber },
  { value: "/", exec: useOperator },
  { value: "4", exec: addNumber },
  { value: "5", exec: addNumber },
  { value: "6", exec: addNumber },
  { value: "*", exec: useOperator },
  { value: "1", exec: addNumber },
  { value: "2", exec: addNumber },
  { value: "3", exec: addNumber },
  { value: "-", exec: useOperator },
  { value: ".", exec: useDecimalPoint },
  { value: "0", exec: addNumber },
  { value: "+", exec: useOperator },
  { value: "=", exec: evaluateExpression },
];

let expression = "0";
let bracketsOpened = 0;
let hasDecimal = false;
let isResulted = false;
let displayElement: HTMLParagraphElement;
let previewElement: HTMLParagraphElement;
const operators = ["+", "-", "*", "/"];

function init(element: HTMLElement) {
  const calculatorElement = document.createElement("div");
  calculatorElement.classList.add("calculator");
  element.append(calculatorElement);
  initCalculator(calculatorElement);
  updateDisplay();
}

function initCalculator(rootElement: HTMLElement) {
  const displayHolderElement = document.createElement("div");
  displayHolderElement.classList.add("displayHolder");
  displayElement = document.createElement("p");
  previewElement = document.createElement("p");
  displayElement.classList.add("display");
  previewElement.classList.add("preview");
  displayHolderElement.append(displayElement, previewElement);
  const numPadElement = document.createElement("div");
  numPadElement.classList.add("num-pad");
  rootElement.append(displayHolderElement, numPadElement);
  createNumpad(numPadElement);
}

function createNumpad(numPadElement: HTMLDivElement) {
  numpadMap.forEach((num, i) => {
    const btn = document.createElement("button");
    if (i === 1) btn.ariaLabel = "Clear";
    btn.innerHTML = num.value;
    if (specialBtn.includes(i)) {
      btn.classList.add("special");
    }
    btn.addEventListener("click", () => {
      num.exec(num.value);
      updateDisplay();
      getPreview();
    });
    numPadElement.append(btn);
  });
}

function clearAll() {
  expression = "0";
  bracketsOpened = 0;
  isResulted = false;
}

function clearOne() {
  if (isResulted) {
    clearAll();
    isResulted = false;
    return;
  }
  switch (getLastToken()) {
    case "(":
      bracketsOpened--;
      break;

    case ")":
      bracketsOpened++;
      break;
    case ".":
      hasDecimal = false;
      break;
  }
  expression = expression.substring(0, expression.length - 1);
  if (expression.length === 0) expression = "0";
}

function openBracket() {
  const lastToken = getLastToken();
  if (isResulted) {
    expression = "(";
    isResulted = false;
    return;
  }
  if (lastToken === ".") {
    return;
  }
  if (lastToken === "(") {
    expression += "(";
    bracketsOpened++;
    hasDecimal = false;
    return;
  }
  if (expression.length === 1 && expression[0] === "0") {
    expression = "(";
    bracketsOpened++;
    hasDecimal = false;
    return;
  }
  if (!operators.includes(lastToken)) {
    expression += "*(";
    bracketsOpened++;
    hasDecimal = false;
    return;
  }
  expression += "(";
  bracketsOpened++;
  hasDecimal = false;
  return;
}

function closeBracket() {
  const lastToken = getLastToken();
  if (isResulted) return;
  if (lastToken === ".") return;
  if (lastToken === "(") return;
  if (operators.includes(lastToken)) return;
  if (bracketsOpened > 0) {
    expression += ")";
    hasDecimal = false;
    bracketsOpened--;
    return;
  }
}

function useOperator(operator: string) {
  const lastToken = getLastToken();
  if (isResulted) {
    isResulted = false;
  }
  if (lastToken === ".") return;
  if (operators.includes(lastToken)) return;
  expression += operator;
  hasDecimal = false;
  return;
}

function useDecimalPoint() {
  const lastToken = getLastToken();
  if (isResulted) {
    expression = "0";
    isResulted = false;
  }
  if (hasDecimal) return;
  if (lastToken === ".") return;
  if (lastToken === "(") {
    expression += "0.";
    hasDecimal = true;
    return;
  }
  if (lastToken === ")") {
    expression += "*0.";
    hasDecimal = true;
    return;
  }
  expression += ".";
  hasDecimal = true;
  return;
}

function addNumber(number: string) {
  const lastToken = getLastToken();
  if (isResulted) {
    expression = "0";
    isResulted = false;
  }
  if (expression === "0") {
    expression = number;
    return;
  }
  if (lastToken === ")") {
    expression += `*${number}`;
    return;
  }
  expression += number;
}

function evaluateExpression() {
  const lastToken = getLastToken();
  if (lastToken === "(") return;
  if (bracketsOpened > 0) {
    while (bracketsOpened--) {
      expression += ")";
    }
  }
  try {
    const expFunction = new Function(`return ${expression}`);
    expression = formatNumber(Number(expFunction()));
  } catch (e) {
    expression = "Error";
  }
  isResulted = true;
}

function getPreview() {
  if (isResulted) {
    previewElement.innerText = "";
    return;
  }
  try {
    previewElement.innerText = formatNumber(
      Number(new Function("return " + expression)())
    );
  } catch (e) {
    previewElement.innerText = "";
  }
}

function updateDisplay() {
  if (expression === displayElement.innerText) return;
  displayElement.innerText = expression;
  if (expression === "Error") expression = "0";
}

function getLastToken() {
  return expression[expression.length - 1];
}

function formatNumber(num: number) {
  if (!Number.isFinite(num)) return String(num);
  if (Number.isInteger(num)) {
    if (String(num).length > 10) {
      return num.toExponential(9);
    } else {
      return String(num);
    }
  } else {
    return String(parseFloat(num.toFixed(9)));
  }
}

init(document.querySelector("div.container")!);
