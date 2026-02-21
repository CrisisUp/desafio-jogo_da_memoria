// src/scripts/storage.js

export const Storage = {
    // Busca o recorde puro (número)
    getHighScore() {
        const record = localStorage.getItem("highScore");
        return record ? parseInt(record) : Infinity;
    },

    // Retorna o recorde formatado para o HTML
    getFormattedRecord() {
        const record = localStorage.getItem("highScore");
        return record ? `${record}s` : "--";
    },

    // Gerencia a lógica de salvar
    checkAndSaveRecord(currentTime) {
        const lastRecord = this.getHighScore();

        if (currentTime < lastRecord) {
            localStorage.setItem("highScore", currentTime);
            return { isNewRecord: true, time: currentTime };
        }
        return { isNewRecord: false, record: lastRecord };
    }
};