// DOM Element Selectors
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

// Game State Variables
let score = 0;
let timeLeft = 30;
let gameInterval;
let spawnInterval;
let isPlaying = false;

// Event Listener for the Start/Reset Button
startBtn.addEventListener('click', startGame);

function startGame() {
    // Reset state values
    score = 0;
    timeLeft = 30;
    isPlaying = true;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    // Hide overlay screen
    startScreen.style.display = 'none';

    // Core Intervals
    gameInterval = setInterval(updateTimer, 1000);
    spawnInterval = setInterval(spawnStar, 800); // Adjust milliseconds to alter difficulty
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}

function spawnStar() {
    if (!isPlaying) return;

    // Create a new star element dynamically
    const star = document.createElement('div');
    star.classList.add('star');
    star.textContent = '⭐';

    // Calculate a random horizontal position inside the game board bounds (leave 40px padding)
    const boardWidth = gameBoard.clientWidth;
    const randomX = Math.floor(Math.random() * (boardWidth - 40));
    star.style.left = `${randomX}px`;

    // Click event handler to capture the star
    star.addEventListener('mousedown', () => {
        score++;
        scoreDisplay.textContent = score;
        star.remove(); // Instantly clears the star upon click
    });

    // Automatically clean up stars that finish their falling animation without being clicked
    star.addEventListener('animationend', () => {
        star.remove();
    });

    gameBoard.appendChild(star);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);

    // Remove any remaining stars lingering on the board
    const activeStars = document.querySelectorAll('.star');
    activeStars.forEach(star => star.remove());

    // Update overlay UI text to display completion status
    startScreen.style.display = 'flex';
    startScreen.innerHTML = `
        <div style="text-align: center;">
            <h2 style="margin-bottom: 15px; color: #ffdf00;">Game Over!</h2>
            <p style="font-size: 1.25rem; margin-bottom: 20px;">Your Final Score: ${score}</p>
            <button id="start-btn" onclick="location.reload()">Play Again</button>
        </div>
    `;
}
