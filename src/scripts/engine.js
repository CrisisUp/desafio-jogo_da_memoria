import { Storage } from './storage.js';
import { UI } from './ui.js';

// ==========================================
// 1. ESTADO E CONFIGURAÇÕES (Agora protegidos pelo módulo)
// ==========================================
const emojis = ["🍅", "🍅", "🥸", "🥸", "🥶", "🥶", "🤢", "🤢", "🙋🏻‍♂️", "🙋🏻‍♂️", "🙈", "🙈", "🥱", "🥱", "🤡", "🤡"];
let openCards = [];
let timerInterval;
let gameMode = "casual";
let timeLeft = 60;
let secondsPassed = 0;
let moves = 0;

// ==========================================
// 2. INICIALIZAÇÃO
// ==========================================
const init = () => {
    // Agora o engine.js não precisa saber como o dado é guardado, 
    // ele apenas pede o valor formatado para o Storage.
    const highScoreSpan = document.getElementById("high-score");
    if (highScoreSpan) {
        highScoreSpan.innerText = Storage.getFormattedRecord();
    }

    const shuffleEmojis = emojis.sort(() => (Math.random() > 0.5 ? 2 : -1));
    const gameContainer = document.querySelector(".game");
    
    shuffleEmojis.forEach((emoji) => {
        let box = document.createElement("div");
        box.className = "item";
        box.innerHTML = emoji;
        box.onclick = handleClick;
        gameContainer.appendChild(box);
    });

    setupEventListeners();
};

const setupEventListeners = () => {
    document.getElementById("btn-casual").onclick = () => startGame("casual");
    document.getElementById("btn-desafio").onclick = () => startGame("desafio");
    document.querySelectorAll(".reset").forEach(button => {
        button.onclick = () => window.location.reload();
    });
};

const startGame = (mode) => {
    gameMode = mode;
    document.getElementById("start-modal").style.display = "none";
};

// ==========================================
// 3. MECÂNICA DO JOGO
// ==========================================
function handleClick() {
    startTimer();

    if (openCards.length < 2 && !this.classList.contains("boxOpen") && !this.classList.contains("boxMatch")) {
        this.classList.add("boxOpen");
        openCards.push(this);
    }

    if (openCards.length === 2) {
        moves++;
        document.getElementById("moves").innerText = moves;
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = openCards;

    if (card1.innerHTML === card2.innerHTML) {
        card1.classList.add("boxMatch");
        card2.classList.add("boxMatch");
    } else {
        card1.classList.remove("boxOpen");
        card2.classList.remove("boxOpen");
    }

    openCards = [];
    checkWin();
}

// ==========================================
// 4. TEMPO E STATUS
// ==========================================
function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        if (gameMode === "desafio") {
            timeLeft--;
            renderTime(timeLeft);
            if (timeLeft <= 10) document.getElementById("timer").classList.add("timer-low");
            if (timeLeft <= 0) endGame(false);
        } else {
            secondsPassed++;
            renderTime(secondsPassed);
        }
    }, 1000);
}

// ==========================================
// 5. FINALIZAÇÃO
// ==========================================
function checkWin() {
    if (document.querySelectorAll(".boxMatch").length === emojis.length) {
        endGame(true);
    }
}

function endGame(isWin) {
    clearInterval(timerInterval);
    
    if (!isWin) {
        document.querySelectorAll(".item").forEach(card => card.onclick = null);
        return UI.showModal("GAME OVER 💀", "Que pena! O tempo acabou.");
    }

    if (gameMode === "desafio") {
        const timeSpent = 60 - timeLeft;
        const result = Storage.checkAndSaveRecord(timeSpent);
        
        const title = result.isNewRecord ? "NOVO RECORDE! 🏆" : "VITÓRIA! 🏁";
        const msg = result.isNewRecord ? `Incrível! Melhor tempo: ${result.time}s.` : `Tempo: ${timeSpent}s. Recorde: ${result.record}s.`;
        UI.showModal(title, msg);
    } else {
        UI.showModal("VITÓRIA! ✨", `Modo Casual concluído em ${secondsPassed}s.`);
    }
}

// Inicializa o jogo
init();