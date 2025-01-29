document.addEventListener('DOMContentLoaded', () => {
    createSquaares();

    const keys = document.querySelectorAll('.keyboard-row button');

    let guessedWords = [[]];

    let availableSpace = 1;

    for (let index = 0; index < keys.length; index++) {
        keys[index].onclick = ({ target }) => {
            const letter = target.getAttribute('data-key');
            updateGuessedWords(letter)
        };
    }

    function getCurrentWordArray() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArray = getCurrentWordArray();

        if (currentWordArray && currentWordArray.length < 5) {
            currentWordArray.push(letter)

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1

            availableSpaceEl.textContent = letter;
        }

    }

    function createSquaares() {
        const gameBoard = document.getElementById('board');

        for (let index = 0; index < 30; index++) {
            let square = document.createElement('div');
            square.classList.add('square');
            square.setAttribute('id', index + 1);
            gameBoard.appendChild(square);
        }
    }


});