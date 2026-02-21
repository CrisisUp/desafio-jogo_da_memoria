// src/scripts/ui.js

export const UI = {
    // Atualiza o texto do timer na tela
    renderTime(value, timerElementId = "timer") {
        const mins = Math.floor(value / 60).toString().padStart(2, '0');
        const secs = (value % 60).toString().padStart(2, '0');
        const element = document.getElementById(timerElementId);
        
        if (element) {
            element.innerText = `${mins}:${secs}`;
        }
    },

    // Adiciona o efeito visual de tempo baixo
    setTimerLowStyle(isLow, timerElementId = "timer") {
        const element = document.getElementById(timerElementId);
        if (element) {
            if (isLow) {
                element.classList.add("timer-low");
            } else {
                element.classList.remove("timer-low");
            }
        }
    },

    // Exibe qualquer modal (vitória ou derrota)
    showModal(title, message, modalId = "modal") {
        document.getElementById(`${modalId}-title`).innerText = title;
        document.getElementById(`${modalId}-message`).innerText = message;
        document.getElementById(modalId).style.display = "flex";
    },

    // Atualiza o contador de jogadas
    updateMoves(value) {
        const element = document.getElementById("moves");
        if (element) element.innerText = value;
    }
};