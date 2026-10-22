// Dom emlements
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const restartButton = document.getElementById("restartButton");
const attemptsDisplay = document.getElementById("attempts");
const bestScoreDisplay = document.getElementById("bestScore");
const hint = document.getElementById("hint");
const message = document.getElementById("message");
const previousGuesses = document.getElementById("previousGuesses");
const secretDisplay = document.getElementById("secretDisplay");
const gameCard = document.querySelector(".game-card");

// variables
let secretNumber;
let attempts;
let gameOver;
let guesses;

// start game
function startGame() {
    // generate random number between 1 and 104
    secretNumber = Math.floor(Math.random()*104)+1;
    attempts = 0;
    gameOver= false;
    guesses = [];

    attemptsDisplay.textContent = "0";
    secretDisplay.textContent= "?";
    hint.textContent = "Make your first guess. ";
    message.textContent = "Enter a number to begin. ";
    message.className = "message";
    previousGuesses.innerHTML = `<span class="empty"> No guesses yet </span>`;
    secretDisplay.parentElement.classList.remove("win");

    guessInput.value = "";
    guessInput.disabled = false;
    guessButton.disabled = false;
    guessInput.focus();
}

function makeGuess() {
    if (gameOver) {
        return;
    }
    const guess = Number(guessInput.value);

    if (guess < 1 || guess > 104 || !Number.isInteger(guess)) {
        showMessage("Please enter a whole number between 1 and 104. ", "high");
        shakeGame();
        guessInput.focus();
        return;
    }

    // prevent duplicate guess
    if (guesses.includes(guess)) {
        showMessage("You already guessed that number . " , "high");
        shakeGame();
        guessInput.select();
        return;
    }

    // save guess
    guesses.push(guess);
    attempts++;
    attemptsDisplay.textContent = attempts;
    addPreviousGuess(guess);

    // check guess
    if (guess === secretNumber) {
        winGame();
    }else if (guess < secretNumber) {
        showMessage("Too low ! Try a higher number . " , "low");
        hint.textContent = "The secret number is higher. ";
    }else{
        showMessage("Too high! Try a lower number. ", "high");
        hint.textContent = "The secret number is lower.";
    }

    // clear input
    guessInput.value = "";
    guessInput.focus();
}

// add previous guess
function addPreviousGuess(number) {
    const empty = previousGuesses.querySelector(".empty");
    if (empty) {
        empty.remove();
    }

    const guessElement = document.createElement("span");
    guessElement.classList.add("guess-item");
    guessElement.textContent = number;
    previousGuesses.appendChild(guessElement);
}


// win game
function winGame() {
    gameOver = true;

    //show secret number
    secretDisplay.textContent = secretNumber;

    secretDisplay.parentElement.classList.add("win");

    // show message
    showMessage(`Correct! You found the number in ${attempts} attempt ${attempts === 1 ? "" : "s"}.` , "correct");

    hint.textContent = "Excellent guess!";

    // disable input
    guessInput.disabled = true;
    guessButton.disabled = true;

    // save
    saveBestScore();
}


// save best score
function loadBestScore() {
    const best =
        localStorage.getItem(
            "numberGameBest"
        );
    if (best !== null) {
        bestScoreDisplay.textContent =
            best;
    }
}
// SHOW MESSAGE
function showMessage(
    text,
    type = ""
) {
    message.textContent =
        text;
    message.className =
        "message";
    if (type) {
        message.classList.add(type);
    }
}
// shake game
function shakeGame() {
    gameCard.classList.remove(
        "shake"
    );
    /* Force browser reflow.*/
    void gameCard.offsetWidth;
    gameCard.classList.add(
        "shake"
    );
}



guessInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        makeGuess();
    }
});


// guess button
guessButton.addEventListener("click",makeGuess);

// restart button
restartButton.addEventListener("click",startGame);

// initialize game
loadBestScore();
startGame();