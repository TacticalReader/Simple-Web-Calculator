// State variables
let currentInput = "";
let calculationPerformed = false;

// DOM Elements
const displayInput = document.getElementById("input");
const buttons = document.querySelector(".buttons");
const themeSwitcher = document.getElementById("theme-switcher");

// --- THEME SWITCHER ---
const applyTheme = (theme) => {
  document.body.setAttribute("data-theme", theme);
  themeSwitcher.checked = theme === 'light';
  localStorage.setItem("theme", theme);
};

themeSwitcher.addEventListener("change", () => {
  applyTheme(themeSwitcher.checked ? 'light' : 'dark');
});

// Apply saved theme on load or default to dark
const savedTheme = localStorage.getItem("theme") || 'dark';
applyTheme(savedTheme);

// --- CALCULATOR LOGIC ---

const updateDisplay = () => {
  displayInput.value = currentInput || "0";
};

const handleNumber = (value) => {
  if (calculationPerformed) {
    currentInput = "";
    calculationPerformed = false;
  }
  currentInput += value;
};

const handleOperator = (value) => {
  if (currentInput === "" && value !== "-") return;
  calculationPerformed = false;
  const lastChar = currentInput.slice(-1);
  // Prevent multiple operators in a row, but allow for negative numbers
  if (['+', '-', '*', '/'].includes(lastChar)) {
    currentInput = currentInput.slice(0, -1);
  }
  currentInput += value;
};

const handleDecimal = () => {
  if (calculationPerformed) {
    currentInput = "0.";
    calculationPerformed = false;
    return;
  }
  const parts = currentInput.split(/[\+\-\*\/]/);
  const lastPart = parts[parts.length - 1];
  if (!lastPart.includes(".")) {
    currentInput += ".";
  }
};

const solve = () => {
  if (currentInput === "") return;
  try {
    const sanitizedInput = currentInput.replace(/[^-\d/*+.]/g, '');
    if (sanitizedInput !== currentInput) {
        throw new Error("Invalid characters in input");
    }
    
    const result = new Function(`return ${sanitizedInput}`)();
    
    currentInput = String(parseFloat(result.toPrecision(15)));
    calculationPerformed = true;
  } catch (err) {
    currentInput = "Error";
    calculationPerformed = true;
  }
  updateDisplay();
};

const clearInput = () => {
  currentInput = "";
  calculationPerformed = false;
  updateDisplay();
};

const eraseLast = () => {
  if (calculationPerformed) {
    clearInput();
    return;
  }
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
};

const calculatePercent = () => {
    if (currentInput === "") return;
    try {
        const result = new Function(`return ${currentInput}`)() / 100;
        currentInput = String(parseFloat(result.toPrecision(15)));
        calculationPerformed = true;
    } catch (err) {
        currentInput = "Error";
        calculationPerformed = true;
    }
    updateDisplay();
};

const calculateSquareRoot = () => {
    if (currentInput === "" || currentInput === "Error") return;
    try {
        // First, evaluate the expression in the display
        const value = new Function(`return ${currentInput}`)();
        if (value < 0) {
            currentInput = "Error"; // Can't take sqrt of a negative number
        } else {
            const result = Math.sqrt(value);
            currentInput = String(parseFloat(result.toPrecision(15)));
        }
        calculationPerformed = true;
    } catch (err) {
        currentInput = "Error";
        calculationPerformed = true;
    }
    updateDisplay();
};

// --- EVENT LISTENERS ---

buttons.addEventListener("click", (e) => {
  const target = e.target.closest('button');
  if (!target) return;

  const value = target.dataset.value;

  if (target.matches(".input-button")) {
    if (value === ".") {
      handleDecimal();
    } else if (['+', '-', '*', '/'].includes(value)) {
      handleOperator(value);
    } else {
      handleNumber(value);
    }
  } else {
    switch (target.id) {
      case "equal":
        solve();
        break;
      case "clear":
        clearInput();
        break;
      case "erase":
        eraseLast();
        break;
      case "sqrt":
        calculateSquareRoot();
        break;
      case "percent":
        calculatePercent();
        break;
    }
  }
  
  if (target.id !== 'equal' && target.id !== 'percent' && target.id !== 'sqrt' && currentInput !== "Error") {
      updateDisplay();
  }
});

document.addEventListener("keydown", (e) => {
  const key = e.key;
  let handled = true;

  if (/\d/.test(key)) {
    handleNumber(key);
  } else if (key === ".") {
    handleDecimal();
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
  } else if (key === "Enter" || key === "=") {
    solve();
  } else if (key === "Backspace") {
    eraseLast();
  } else if (key === "Escape" || key === "Delete") {
    clearInput();
  } else {
    handled = false;
  }
  
  if (handled) {
    e.preventDefault();
    if (key !== 'Enter' && key !== '=' && currentInput !== "Error") {
        updateDisplay();
    }
  }
});

// Initial display update
updateDisplay();
