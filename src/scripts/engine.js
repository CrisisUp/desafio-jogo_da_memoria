import { Storage } from './storage.js';
import { UI } from './ui.js';

// ==========================================
// 1. ESTADO E CONFIGURAÇÕES
// ==========================================
const emojisNormal = ["🍅", "🍅", "🥸", "🥸", "🥶", "🥶", "🤢", "🤢", "🙋🏻‍♂️", "🙋🏻‍♂️", "🙈", "🙈", "🥱", "🥱", "🤡", "🤡"];
const emojisHard = [
    ...emojisNormal, 
    "👻", "👻", "👽", "👽", "🤖", "🤖", "🎃", "🎃", "⭐", "⭐", 
    "🔥", "🔥", "🌈", "🌈", "⚡", "⚡", "💎", "💎", "🍀", "🍀"
].slice(0, 36); 

let currentEmojis = emojisNormal;
let openCards = [];
let timerInterval;
let gameMode = "casual";
let timeLeft = 60;
let secondsPassed = 0;
let moves = 0;
let nextGameIsHard = false; // FLAG CRÍTICA PARA O MASTER

const init = (isHard = false) => {
    // ATUALIZAÇÃO: Busca e renderiza o recorde na tela de início
    const highScoreSpan = document.getElementById("high-score");
    if (highScoreSpan) {
        highScoreSpan.innerText = Storage.getFormattedRecord();
    }
    // Reset Total de Estados
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    openCards = [];
    moves = 0;
    timeLeft = 60;
    secondsPassed = 0;
    currentEmojis = isHard ? emojisHard : emojisNormal;
    
    // UI: Prepara Grid e Stats
    UI.setupGrid(isHard);
    UI.updateMoves(0);
    UI.renderTime(60); 

    const shuffleEmojis = [...currentEmojis].sort(() => (Math.random() > 0.5 ? 2 : -1));
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
        button.onclick = () => {
            // Se o nível Master foi desbloqueado, não damos reload para não perder o estado
            if (nextGameIsHard) {
                document.getElementById("modal").style.display = "none";
                UI.setTimerLowStyle(false);
                init(true);
                nextGameIsHard = false;
            } else {
                window.location.reload();
            }
        };
    });
};

const startGame = (mode) => {
    gameMode = mode;
    document.getElementById("start-modal").style.display = "none";
};

// ==========================================
// 3. MECÂNICA DO JOGO (COM TRATAMENTO DE ERRO)
// ==========================================
function handleClick() {
    startTimer();

    // Proteção: Só permite abrir se houver menos de 2 abertas e se não for a mesma carta
    if (openCards.length < 2 && !this.classList.contains("boxOpen") && !this.classList.contains("boxMatch")) {
        this.classList.add("boxOpen");
        openCards.push(this);
    }

    if (openCards.length === 2) {
        moves++;
        UI.updateMoves(moves);
        // Pequeno delay para o usuário ver a segunda carta antes de checar
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    // CORREÇÃO DO ERRO DO CONSOLE: Verifica se ainda existem 2 cartas no array
    if (openCards.length < 2) return;

    const [card1, card2] = openCards;

    // Proteção extra contra undefined
    if (!card1 || !card2) {
        openCards = [];
        return;
    }

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
            UI.renderTime(timeLeft);
            if (timeLeft <= 10) UI.setTimerLowStyle(true);
            if (timeLeft <= 0) endGame(false);
        } else {
            secondsPassed++;
            UI.renderTime(secondsPassed);
        }
    }, 1000);
}

// ==========================================
// 5. FINALIZAÇÃO E DESBLOQUEIO MASTER
// ==========================================
function checkWin() {
    const matchedCards = document.querySelectorAll(".boxMatch");
    if (matchedCards.length === currentEmojis.length) {
        endGame(true);
    }
}

function endGame(isWin) {
    clearInterval(timerInterval);
    
    if (!isWin) {
        document.querySelectorAll(".item").forEach(card => card.onclick = null);
        return UI.showModal("GAME OVER 💀", "Que pena! O tempo acabou.");
    }

    const timeSpent = gameMode === "desafio" ? (60 - timeLeft) : secondsPassed;

    // GATILHO MASTER: Vitória abaixo de 23s no tabuleiro original (16 cartas)
    if (gameMode === "desafio" && timeSpent < 23 && currentEmojis.length === 16) {
        nextGameIsHard = true; 
        return UI.showModal("NÍVEL MASTER DESBLOQUEADO! 🔥", 
            `Incrível! Você fez em ${timeSpent}s. Clique em JOGAR NOVAMENTE para o tabuleiro 6x6.`);
    }

    // Fluxo normal de vitória/recorde
    if (gameMode === "desafio") {
        const result = Storage.checkAndSaveRecord(timeSpent);
        const title = result.isNewRecord ? "NOVO RECORDE! 🏆" : "VITÓRIA! 🏁";
        const msg = result.isNewRecord ? `Novo recorde: ${result.time}s.` : `Tempo: ${timeSpent}s. Recorde: ${result.record}s.`;
        UI.showModal(title, msg);
    } else {
        UI.showModal("VITÓRIA! ✨", `Modo Casual concluído em ${secondsPassed}s.`);
    }
}

init();