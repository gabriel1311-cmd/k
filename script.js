// Contraseña correcta en binario
const correctPassword = 'wood';
const startDate = new Date('2025-10-09');

// Elementos del DOM
const lockScreen = document.getElementById('lockScreen');
const mainContent = document.getElementById('mainContent');
const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMessage = document.getElementById('errorMessage');
const heartsContainer = document.getElementById('heartsContainer');
const poemDisplay = document.getElementById('poemDisplay');
const lockedMessage = document.getElementById('lockedMessage');
const poemTitle = document.getElementById('poemTitle');
const poemBody = document.getElementById('poemBody');
const poemCounter = document.getElementById('poemCounter');

// Verificar contraseña
function checkPassword() {
    const input = passwordInput.value.trim();
    if (input === correctPassword) {
        lockScreen.classList.remove('active');
        mainContent.classList.add('active');
        loadPoem();
        createHearts();
    } else {
        errorMessage.textContent = 'Parece que tu corazón aún no recuerda el código correcto 💫';
        passwordInput.value = '';
        setTimeout(() => {
            errorMessage.textContent = '';
        }, 3000);
    }
}

unlockBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Crear corazones flotantes
function createHearts() {
    const hearts = ['💖', '💕', '💗', '💓', '💝'];
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heart.style.fontSize = (Math.random() * 1 + 1.5) + 'rem';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 800);
}

// Cargar poema del día
async function loadPoem() {
    try {
        const response = await fetch('poems.json');
        const poems = await response.json();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < poems.length) {
            const currentPoem = poems[diffDays];
            poemTitle.textContent = currentPoem.title;
            poemBody.textContent = currentPoem.body;
            poemCounter.textContent = `Poema ${diffDays + 1} de 100`;
            poemDisplay.style.display = 'block';
            lockedMessage.classList.remove('active');
        } else {
            const nextDate = new Date(startDate);
            nextDate.setDate(nextDate.getDate() + diffDays + 1);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = nextDate.toLocaleDateString('es-ES', options);
            lockedMessage.textContent = `✨ El próximo poema se desbloqueará el ${formattedDate} ✨`;
            lockedMessage.classList.add('active');
            poemDisplay.style.display = 'none';
        }
    } catch (error) {
        console.error('Error al cargar los poemas:', error);
        lockedMessage.textContent = '💫 No se pudieron cargar los poemas. Por favor, recarga la página 💫';
        lockedMessage.classList.add('active');
    }
}