let display = document.getElementById('result');
let shouldResetDisplay = false;

// Theme Toggle
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('calculatorTheme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('calculatorTheme', 'light');
        }
    });
}

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    if (display.value === '' || display.value === '0') {
        if (value === '.') {
            display.value = '0.';
        } else if (value !== '0') {
            display.value = value;
        } else {
            display.value += value;
        }
    } else {
        if (value === '.') {
            let parts = display.value.split(/[\+\-\*\/]/);
            let lastPart = parts[parts.length - 1];
            if (lastPart.includes('.')) return;
        }
        display.value += value;
    }
}

function clearDisplay() {
    display.value = '';
    shouldResetDisplay = false;
}

function deleteDigit() {
    if (display.value.length > 0) {
        display.value = display.value.slice(0, -1);
    }
}

function calculateResult() {
    try {
        if (display.value === '') return;
        let expression = display.value.replace(/×/g, '*');
        let result = Function('"use strict"; return (' + expression + ')')();
        display.value = result.toString();
        shouldResetDisplay = true;
    } catch {
        display.value = 'Error';
        shouldResetDisplay = true;
    }
}

document.addEventListener('keydown', event => {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if ('+-*/'.includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteDigit();
    } else if (key.toLowerCase() === 't') {
        document.getElementById('theme-toggle').click();
    }
});

window.onload = () => {
    display.value = '';
    display.focus();
    initializeTheme();
};
