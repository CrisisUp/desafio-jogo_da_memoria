# 🧠 Memory Game - Pro Edition

Este é um projeto de Jogo da Memória desenvolvido com foco em Arquitetura Modular, Clean Code e Segurança de Escopo. Criado como parte de um estudo avançado de front-end para o curso de Técnico em Redes.

## 🚀 Funcionalidades

### Dois Modos de Jogo

* **`Casual`:** Cronômetro progressivo para prática livre.

* **`Desafio`:** Contagem regressiva de 60 segundos com sistema de Game Over.

### Também

* **Persistência de Recordes:** Salva automaticamente o melhor tempo no localStorage do navegador.

* **Interface Responsiva:** Layout adaptável para dispositivos móveis e desktops.

* **Segurança de Escopo:** Implementado via ES Modules, protegendo variáveis internas contra manipulação direta via console.

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica.

* **CSS3:** Variáveis nativas (:root), Flexbox, animações e efeitos 3D (preserve-3d).

* **JavaScript (ES6+):** Modularização, manipulação de DOM e persistência local.

## 🏗️ Arquitetura do Projeto

O projeto foi refatorado para seguir o princípio de Responsabilidade Única (SRP), dividindo-se em módulos específicos:

* **engine.js:** O motor principal. Orquestra a lógica do jogo e o fluxo de cliques.

* **storage.js:** Módulo de dados. Gerencia toda a leitura e gravação no localStorage.

* **ui.js:** Módulo de interface. Centraliza a manipulação do DOM, modais e renderização do tempo.

## 🔒 Segurança e Melhores Práticas

* **Escopo Fechado:** O uso de módulos impede que o usuário altere variáveis de estado (como timeLeft) pelo console do desenvolvedor.

* **Desacoplamento:** A interface não conhece a lógica de dados, e a lógica de dados não conhece o HTML, facilitando manutenções e testes.

* **Clean Code:** Código escrito de forma declarativa, com funções curtas e nomes semânticos.

## 📂 Estrutura de Arquivos

```Plaintext
.
├── index.html
└── src
    ├── scripts
    │   ├── engine.js    # Core do jogo
    │   ├── storage.js   # Persistência de recordes
    │   └── ui.js        # Manipulação de interface
    └── styles
        ├── main.css     # Estilização e variáveis
        └── reset.css    # Normalização de estilos
```

## 🌟 Diferenciais Técnicos (Desafio Master)

### Sistema de Dificuldade Evolutiva

O projeto conta com um gatilho de performance:

* **Detecção de Velocidade:** Vitórias abaixo de 23s ativam o modo Master.
  
* **Injeção Dinâmica:** O `engine.js` alterna o set de emojis e reconstrói o DOM sem `window.location.reload()`.

* **Cálculo de Grid:** O CSS adapta o entorno do tabuleiro dinamicamente (de 430px para 650px) para acomodar 36 cartas de 100px, preservando a experiência visual e proibindo barras de rolagem.

### Variáveis e Design System

* **Escalabilidade:** Todo o design é controlado via `:root`, permitindo ajustes globais de `border-radius`, `gap` e `opacity` em um único ponto.

## 🛠️ Como Executar o Projeto

Como o projeto utiliza **ES Modules** para manter a segurança de escopo e organização, ele não pode ser aberto diretamente pelo sistema de arquivos (`file://`).

1. Certifique-se de ter o **`VS Code`** instalado.
2. Instale a extensão **`Live Server`**.
3. Clique com o botão direito no `index.html` e selecione **"Open with Live Server"**.
4. O jogo abrirá em `http://127.0.0.1:5500`.
