const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const timerElement = document.getElementById('timer');
const highscoresList = document.getElementById('highscores-list');

let shuffledQuestions, currentQuestionIndex, timerInterval, timerCount, score;

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

function startGame() {
    startButton.classList.add('hide');
    nextButton.classList.remove('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    score = 0; 
    setNextQuestion();
    startTimer();
}

function startTimer() {
    timerCount = 45; // Set timer count to 45 seconds
    timerInterval = setInterval(updateTimer, 1000); // Update timer every second
}

function updateTimer() {
    timerCount--; // Decrement timer count
    timerElement.innerText = `Time Left: ${timerCount}s`;

    if (timerCount <= 0) {
        clearInterval(timerInterval); // Stop the timer when it reaches zero
        
        gameOver();
    }
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = true;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearInterval(timerInterval); // Clear the timer
    timerElement.innerText = ''; // Reset the timer display
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";

    // Update score based on correct answer
    if (correct) {
        score += 5; // Award 5 points for correct answer
    }

    setStatusClass(selectedButton, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button !== selectedButton) {
            setStatusClass(button, button.dataset.correct === "true");
        }
    });

    if (!correct) {
        // Decrease the timer by 10 seconds for wrong answers
        timerCount -= 10;
        if (timerCount < 0) timerCount = 0; // Ensure timer doesn't go negative
    }

    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        gameOver();
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function gameOver() {
    questionContainerElement.classList.add('hide'); 
    answerButtonsElement.innerHTML = ''; 
    nextButton.classList.add('hide'); 

    // Calculate score based on remaining time
    score += Math.floor(timerCount / 5); // Award 1 point for every 5 seconds left
    questionContainerElement.classList.add('hide');

    const playerName = prompt("Game Over! Please enter your name to save your score:");
    if (playerName && playerName.trim() !== '') {
        const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
        highscores.push({ name: playerName, score: score });
        highscores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highscores', JSON.stringify(highscores));
        // Displays highscores
        displayHighscores(highscores);
    } else if (playerName === '') {
        alert("You didn't enter your name. Score not saved.");
    } else {
        alert("Score not saved.");
    }

    startButton.innerText = 'Restart'; 
    startButton.classList.remove('hide'); 
}

function displayHighscores(highscores) {
    // Clear existing highscores
    highscoresList.innerHTML = '';
    highscores.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${entry.name}: ${entry.score}`;
        highscoresList.appendChild(listItem);
    });
}

// Call displayHighscores function to initially populate the highscores
const initialHighscores = JSON.parse(localStorage.getItem('highscores')) || [];
displayHighscores(initialHighscores);

const questions = [
    {
        question: "What is the output of console.log(2 + '2')?",
        answers: [
            { text: "4", correct:false },
            { text: "'22'", correct: true },
            { text: "NaN", correct: false},
            { text: "undefined", correct: false}
        ],
    },
    {
        question: "What does the typeof operator return for null?",
        answers: [
            { text: "'number'", correct:false },
            { text: "'string'", correct: false},
            { text: "'object'", correct: true },
            { text: "'null'", correct: false}
        ],
    },
    {
        question: "What is the result of 3 === '3'?",
        answers: [
            { text: "true", correct:false },
            { text: "false", correct: true },
            { text: "NaN", correct: false},
            { text: "SyntaxError", correct: false}
        ]
    },
    {
        question: "What does the Array.prototype.map() method do?",
        answers: [
            { text: "Modifies the original array", correct:false },
            { text: "Removes elements from the array", correct:false },
            { text: "Creates a new array by applying a function to each element", correct: true },
            { text: "Sorts the array alphabetically", correct:false },
        ]
    },
    {
        question: "What is a closure in JavaScript?",
        answers: [
            { text: "A variable with global scope", correct:false },
            { text: "A way to declare constants in JavaScript", correct:false },
            { text: "A combination of a function and the lexical environment within which it was declared", correct: true },
            { text: "A method to prevent code execution", correct:false },
        ],
        answer: "c"
    }
];

const storedHighscores = JSON.parse(localStorage.getItem('highscores')) || [];
displayHighscores(storedHighscores);

