// Configuración
const START_DATE = new Date('2025-10-09');
const END_DATE = new Date('2026-01-16');
const CORRECT_PASSWORD = '01110011 01101110 01101111 01101111 01110000 01111001';

// Elementos del DOM
const lockScreen = document.getElementById('lockScreen');
const mainContent = document.getElementById('mainContent');
const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMessage = document.getElementById('errorMessage');
const poemTitle = document.getElementById('poemTitle');
const poemBody = document.getElementById('poemBody');
const poemCounter = document.getElementById('poemCounter');
const remainingPoems = document.getElementById('remainingPoems');
const nextPoemTime = document.getElementById('nextPoemTime');
const heartsContainer = document.getElementById('heartsContainer');

// Variable global para almacenar los poemas
let poems = [];

// Función para verificar la contraseña
function checkPassword() {
    const inputValue = passwordInput.value.trim();
    
    if (inputValue === CORRECT_PASSWORD) {
        unlockPage();
    } else {
        showError();
    }
}

// Función para desbloquear la página
function unlockPage() {
    lockScreen.classList.add('fade-out');
    setTimeout(() => {
        lockScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        loadPoems();
        startHeartAnimation();
    }, 1000);
}

// Función para mostrar error
function showError() {
    errorMessage.textContent = 'Parece que tu corazón aún no recuerda el código correcto 💫';
    passwordInput.value = '';
    passwordInput.focus();
    
    setTimeout(() => {
        errorMessage.textContent = '';
    }, 3000);
}

// Función para cargar los poemas
async function loadPoems() {
    try {
        const response = await fetch('poems.json');
        if (!response.ok) throw new Error('Error al cargar poemas');
        
        poems = await response.json();
        displayCurrentPoem();
        updateTimeCounter();
        
        // Actualizar el contador cada 60 segundos
        setInterval(updateTimeCounter, 60000);
        
    } catch (error) {
        console.error('Error:', error);
        poemTitle.textContent = '💫 No se pudieron cargar los poemas. Por favor, recarga la página 💫';
    }
}

// Función para calcular el día actual
function getCurrentDayIndex() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(START_DATE);
    startDate.setHours(0, 0, 0, 0);
    
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

// Función para mostrar el poema actual
function displayCurrentPoem() {
    const dayIndex = getCurrentDayIndex();
    const today = new Date();
    
    // Si aún no ha llegado la fecha de inicio
    if (dayIndex < 0) {
        poemTitle.textContent = '✨ El primer poema se desbloqueará el 9 de octubre de 2025 ✨';
        poemBody.textContent = '';
        poemCounter.textContent = '';
        remainingPoems.textContent = '';
        return;
    }
    
    // Si ya pasaron los 100 días
    if (dayIndex >= 100) {
        poemTitle.textContent = '✨ Todos los poemas han sido desbloqueados ✨';
        poemBody.textContent = '💖 Gracias por estos 100 días de amor 💖';
        poemCounter.textContent = '';
        remainingPoems.textContent = '';
        nextPoemTime.textContent = '';
        return;
    }
    
    // Mostrar el poema del día
    if (poems[dayIndex]) {
        const poem = poems[dayIndex];
        poemTitle.textContent = poem.title;
        poemBody.textContent = poem.body;
        
        // Actualizar contadores
        const poemNumber = dayIndex + 1;
        poemCounter.textContent = `Poema ${poemNumber} de 100`;
        
        const remaining = 100 - poemNumber;
        if (remaining > 0) {
            remainingPoems.textContent = `✨ Faltan ${remaining} poemas por desbloquear ✨`;
        } else {
            remainingPoems.textContent = `✨ Este es el último poema ✨`;
        }
    }
}

// Función para actualizar el contador de tiempo
function updateTimeCounter() {
    const dayIndex = getCurrentDayIndex();
    
    // Si no estamos en el rango válido, no mostrar contador
    if (dayIndex < 0 || dayIndex >= 99) {
        nextPoemTime.textContent = '';
        return;
    }
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diffMs = tomorrow - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    nextPoemTime.textContent = `⏰ Próximo poema en ${hours} horas y ${minutes} minutos ⏰`;
}

// Función para crear corazones flotantes
function createHeart() {
    const hearts = ['💖', '💕', '💗', '💓', '💝'];
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    
    // Posición horizontal aleatoria
    heart.style.left = Math.random() * 100 + '%';
    
    // Tamaño aleatorio
    const size = Math.random() * 1 + 1.5;
    heart.style.fontSize = size + 'rem';
    
    // Duración aleatoria
    const duration = Math.random() * 3 + 5;
    heart.style.animationDuration = duration + 's';
    
    heartsContainer.appendChild(heart);
    
    // Eliminar el corazón después de la animación
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Función para iniciar la animación de corazones
function startHeartAnimation() {
    createHeart();
    setInterval(createHeart, 800);
}

// Event Listeners
unlockBtn.addEventListener('click', checkPassword);

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Focus inicial en el campo de contraseña
passwordInput.focus();