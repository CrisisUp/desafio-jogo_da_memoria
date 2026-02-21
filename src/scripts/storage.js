// src/scripts/storage.js

// Constante privada para evitar erros de digitação em múltiplos métodos
const STORAGE_KEY = "highScore";

export const Storage = {
    // Busca o recorde puro (número)
    getHighScore() {
        const record = localStorage.getItem(STORAGE_KEY);
        return record ? parseInt(record) : Infinity;
    },

    // Retorna o recorde formatado para o HTML
    getFormattedRecord() {
        const record = localStorage.getItem(STORAGE_KEY);
        // Ajustado para garantir o formato mm:ss se você preferir no futuro
        return record ? `${record}s` : "--:--";
    },

    // Gerencia a lógica de salvar
    checkAndSaveRecord(currentTime) {
        const lastRecord = this.getHighScore();

        if (currentTime < lastRecord) {
            localStorage.setItem(STORAGE_KEY, currentTime);
            return { isNewRecord: true, time: currentTime };
        }
        return { isNewRecord: false, record: lastRecord };
    },

    // DICA MASTER: Método para resetar o recorde (útil para testes)
    resetRecord() {
        localStorage.removeItem(STORAGE_KEY);
    }
};