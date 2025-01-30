document.addEventListener('DOMContentLoaded', () => {
    createSquaares();
    getNewWord();

    const keys = document.querySelectorAll('.keyboard-row button');

    let guessedWords = [[]];

    let availableSpace = 1;

    let word;

    let guessWordCount = 0;
    function getNewWord() {
        fetch(
            'https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5',
            {
                method: 'GET',
                headers: {
                    'X-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
                    'X-rapidapi-key': '7f51600c66msh422c6cad8f2230dp1b7424jsn898b6f432fd7'
                }
            }
        )
        .then(response => response.json())
        .then((res) => {
            const word = res.word;
            console.log(word);
        })
        .catch(err => {
            console.error(err);
        });
    }
    

    function getCurrentWordArray() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
    }

    function getTileColor(letter, index) { 
        console.log(letter);
        const isCorrectLetter = word.indexOf(letter) !== -1;

        if (!isCorrectLetter) {
            return 'rgb(58,58,60)';
        }

        const letterInThatPostion = word.charAt(index)
        const isCorrectPosition = letter === letterInThatPostion;

        if (isCorrectPosition) {
            return 'rgb(83,141,78)';
        }

        return 'rgb(181,159,59)';
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
            square.classList.add('animate__animated');
            square.setAttribute('id', index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter() {
        const currentWordArray = getCurrentWordArray();
        const removedLetter = currentWordArray.pop();

        guessedWords[guessedWords.length - 1] = currentWordArray;

        const lastLetterEl = document.getElementById(String(availableSpace -1 ));

        lastLetterEl.textContent = '';

        availableSpace = availableSpace -1;
    }

    function handleSubmitWord() {
        const currentWordArray = getCurrentWordArray();

        if (currentWordArray.length !== 5) {
            window.alert('Please enter a 5 letter word');
        }

        const currentWord = currentWordArray.join('');

        fetch(
            'https://wordsapiv1.p.rapidapi.com/words/' + currentWord,
            {
                method: 'GET',
                headers: {
                    'X-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
                    'X-rapidapi-key': '7f51600c66msh422c6cad8f2230dp1b7424jsn898b6f432fd7'
                }
            }
        ).then((res) => {
            if (!res.ok) {
                throw Error();
            }
            const firstLetterId = guessWordCount * 5 + 1;
            const interval = 200;
            currentWordArray.forEach((letter, index) => {
                setTimeout(() => {
                    const tileColor = getTileColor(letter, index)
    
                    const letterId = firstLetterId + index;
    
                    const letterEl = document.getElementById(letterId);
                    letterEl.classList.add('animate__flipInX');
                    letterEl.style = `background-color: ${tileColor};`;
                }, interval * index)
            })
    
            guessWordCount = guessWordCount + 1;
            if (currentWord === word) {
                window.alert('You win!');
            }
    
            if (guessedWords.length === 6) {
                window.alert('You lose! The word is ' + word);
            }
            guessedWords.push([]);
        
        }).catch(() => {
            window.alert('Not a valid word');
        });
    }

    for (let index = 0; index < keys.length; index++) {
        keys[index].onclick = ({ target }) => {
            const letter = target.getAttribute('data-key');

            if (letter === 'enter') {
                handleSubmitWord();
                return;
            }

            if (letter === 'del') {
                handleDeleteLetter();
                return;
            }
            updateGuessedWords(letter)
        };
    }


});