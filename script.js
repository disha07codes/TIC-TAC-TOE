const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const modeToggle = document.getElementById("modeToggle");

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let aiMode = true;

let scores = { X: 0, O: 0 };

const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", resetBoard);
modeToggle.addEventListener("click", toggleMode);

function handleClick() {
    const index = this.getAttribute("data-index");

    if (board[index] !== "" || !gameActive) return;

    makeMove(index, currentPlayer);

    if (aiMode && gameActive && currentPlayer === "O") {
        setTimeout(aiMove, 400);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    checkWinner(player);
}

function aiMove() {
    // 1️⃣ Try to win
    let move = findBestMove("O");
    if (move === null) {
        // 2️⃣ Block player
        move = findBestMove("X");
    }
    if (move === null) {
        // 3️⃣ Random
        const empty = board.map((v,i)=> v===""?i:null).filter(v=>v!==null);
        move = empty[Math.floor(Math.random()*empty.length)];
    }

    makeMove(move, "O");
}

function findBestMove(player) {
    for (let condition of winConditions) {
        const [a,b,c] = condition;
        const values = [board[a], board[b], board[c]];

        if (values.filter(v => v === player).length === 2 &&
            values.includes("")) {

            if (board[a] === "") return a;
            if (board[b] === "") return b;
            if (board[c] === "") return c;
        }
    }
    return null;
}

function checkWinner(player) {
    for (let condition of winConditions) {
        const [a,b,c] = condition;

        if (board[a] === player && board[b] === player && board[c] === player) {

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            scores[player]++;
            scoreX.textContent = scores["X"];
            scoreO.textContent = scores["O"];

            popupText.textContent =
                player === "X"
                ? "YOU SERVED MAIN CHARACTER ENERGY 💅✨"
                : aiMode
                ? "AI OUTSMARTED YOU BESTIE 🤖💀"
                : "Player O SLAYED 💖🔥";

            launchConfetti();
            gameActive = false;
            popup.classList.remove("hidden");
            return;
        }
    }

    if (!board.includes("")) {
        popupText.textContent = "Tie??? That’s awkward 😭";
        popup.classList.remove("hidden");
        gameActive = false;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn 🔥`;
}

function resetBoard() {
    board = ["","","","","","","","",""];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner");
    });
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Player X's turn 👑";
}

function toggleMode() {
    aiMode = !aiMode;
    modeToggle.textContent = aiMode ? "Mode: AI 🤖" : "Mode: Multiplayer 👯";
    resetBoard();
}

function launchConfetti() {
    confetti({
        particleCount: 180,
        spread: 120,
        origin: { y: 0.6 }
    });
}

function closePopup() {
    popup.classList.add("hidden");
    resetBoard();
}