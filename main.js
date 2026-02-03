const generateBtn = document.getElementById('generate-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const lottoNumbers = document.querySelectorAll('.number');
const body = document.body;

function generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    lottoNumbers.forEach((numberEl, index) => {
        numberEl.textContent = sortedNumbers[index];
    });
}

function toggleTheme() {
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }
}

// Set initial theme
body.classList.add('light-mode');

generateBtn.addEventListener('click', generateNumbers);
themeToggleBtn.addEventListener('click', toggleTheme);
