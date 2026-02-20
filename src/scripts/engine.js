(() => {

const emojis = [
    "🍅", "🍅", "🥸", "🥸", "🥶", "🥶", "🤢", "🤢", "🙋🏻‍♂️", "🙋🏻‍♂️", "🙈", "🙈", "🥱", "🥱", "🤡", "🤡",
];

let openCards = [];
let moves = 0;
let seconds = 0;
let timeLeft = 60; // Tempo inicial
let timerInterval;

let shuffleEmojis = emojis.sort(() => (Math.random() > 0.5 ? 2 : -1));

for(let i = 0; i < emojis.length; i++) {
    let box = document.createElement("div");
    box.className = "item";
    box.innerHTML = shuffleEmojis[i];
    box.onclick = handleClick;
    document.querySelector(".game").appendChild(box);
}

document.querySelector(".reset").addEventListener("click", () => {
        window.location.reload();
    });

// Inicia a contagem regressiva na primeira jogada
function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            timeLeft--;
            
            // Formatação para 00:00
            const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const secs = (timeLeft % 60).toString().padStart(2, '0');
            document.getElementById("timer").innerText = `${mins}:${secs}`;

            if (timeLeft <= 10) {
                timerElement.classList.add("timer-low");
            }

            // Lógica de Game Over
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameOver();
            }
        }, 1000);
    }
}

function gameOver() {
    // Bloqueia cliques em todas as cartas para o usuário não continuar jogando
    const allCards = document.querySelectorAll(".item");
    allCards.forEach(card => card.onclick = null);
    
    alert("GAME OVER! O tempo acabou. 💀");
    // Opcional: window.location.reload();
}

function handleClick() {
    startTimer(); // Começa a contar no primeiro clique

    if (openCards.length < 2 && !this.classList.contains("boxOpen") && !this.classList.contains("boxMatch")) {
        this.classList.add("boxOpen");
        openCards.push(this);
    }

    if (openCards.length === 2) {
        moves++; // Incrementa a jogada
        document.getElementById("moves").innerText = moves;
        setTimeout(checkMatch, 500);
    }

    console.log(openCards);
}

function checkMatch() {
    if (openCards[0].innerHTML === openCards[1].innerHTML) {
        openCards[0].classList.add("boxMatch");
        openCards[1].classList.add("boxMatch");
    } else {
        openCards[0].classList.remove("boxOpen");
        openCards[1].classList.remove("boxOpen");
    }

    openCards = [];

    // Verificação de Vitória
    if (document.querySelectorAll(".boxMatch").length === emojis.length) {
        clearInterval(timerInterval);
        alert(`VITÓRIA! Sobrou ${timeLeft} segundos.`);
    }
}

function showModal(title, message) {
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-message").innerText = message;
    document.getElementById("modal").style.display = "flex";
}

// Substitua o alert do gameOver:
function gameOver() {
    const allCards = document.querySelectorAll(".item");
    allCards.forEach(card => card.onclick = null);
    showModal("GAME OVER 💀", "Que pena! O tempo acabou.");
}

// Substitua o alert da vitória no checkMatch:
if (document.querySelectorAll(".boxMatch").length === emojis.length) {
    clearInterval(timerInterval);
    showModal("VITÓRIA! 🏆", `Parabéns! Você terminou em ${60 - timeLeft} segundos.`);
}

})();