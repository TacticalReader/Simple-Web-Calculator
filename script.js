let equal_pressed = 0;

// DOM Elements
const input = document.getElementById("input");
const equal = document.getElementById("equal");
const clear = document.getElementById("clear");
const erase = document.getElementById("erase");
const button_input = document.querySelectorAll(".input-button");
const themeSwitcher = document.getElementById("theme-switcher");

// --- THEME SWITCHER ---
const applyTheme = (theme) => {
  if (theme === 'light') {
    document.body.setAttribute("data-theme", "light");
    themeSwitcher.checked = true;
  } else {
    document.body.setAttribute("data-theme", "dark");
    themeSwitcher.checked = false;
  }
  localStorage.setItem("theme", theme);
};

themeSwitcher.addEventListener("change", () => {
  const newTheme = themeSwitcher.checked ? 'light' : 'dark';
  applyTheme(newTheme);
});

// Apply saved theme on load or default to dark
const savedTheme = localStorage.getItem("theme") || 'dark';
applyTheme(savedTheme);


// --- CALCULATOR LOGIC ---

// Clear input on page load
window.onload = () => {
  input.value = "";
};

// Handle button clicks
button_input.forEach((button) => {
  button.addEventListener("click", () => {
    if (equal_pressed === 1) {
      input.value = "";
      equal_pressed = 0;
    }
    input.value += button.dataset.value;
  });
});

// Solve the user's input
const solve = () => {
  if (input.value === "") return;
  equal_pressed = 1;
  let inp_val = input.value;
  try {
    // Using eval is generally discouraged, but acceptable for this simple project.
    let solution = eval(inp_val);
    if (Number.isInteger(solution)) {
      input.value = solution;
    } else {
      input.value = solution.toFixed(2);
    }
  } catch (err) {
    alert("Invalid Input");
    input.value = "";
  }
};

equal.addEventListener("click", solve);

// Clear Whole Input
const clearInput = () => {
  input.value = "";
};
clear.addEventListener("click", clearInput);

// Erase Single Digit
const eraseLast = () => {
  input.value = input.value.slice(0, -1);
};
erase.addEventListener("click", eraseLast);


// --- KEYBOARD SUPPORT ---
document.addEventListener("keydown", (e) => {
  const key = e.key;
  const validKeys = "0123456789./*-+";

  if (validKeys.includes(key)) {
    e.preventDefault();
    if (equal_pressed === 1) {
      input.value = "";
      equal_pressed = 0;
    }
    input.value += key;
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    solve();
  } else if (key === "Backspace") {
    eraseLast();
  } else if (key === "Delete" || key === "Escape") {
    clearInput();
  }
});
