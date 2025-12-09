// Questions
const questions = [
    {
       type: "text",
        question:
            "1. Fill in the blank: My Bloody Valentine's landmark 1991 album that helped define shoegaze is called ________.",
        correct: "Loveless"
    },
    {
        type: "mc",
        question: "2. In typical shoegaze mixing, how are vocals usually treated?",
        choices: [
            "They are loud, clear, and placed above all instruments.",
            "They are mixed lower and used as another textural layer.",
            "They are removed entirely so the focus is only on guitars."
        ],
        correct: 1
    },
    {
        type: "mc",
        question: "3. Why did British music critics start calling the genre “Shoegaze”?",
        choices: [
            "Because fans at shows stared at their shoes in boredom.",
            "Because musicians played barefoot on stage.",
            "Because guitarists spent shows looking down at their effects pedals on the floor."
        ],
        correct: 2
    },
    {
        type: "mc",
        question: "4. Which of the following is often cited as an early proto-shoegaze album?",
        choices: [
            "Pornography by The Cure",
            "Nevermind by Nirvana",
            "OK Computer by Radiohead"
        ],
        correct: 0
    },
    {
        type: "multi",
        question:
            "5. Multi-select: Which of the following effects are especially important for creating shoegaze guitar tones?",
        choices: [
            "Reverb",
            "Delay",
            "Distortion",
            "Auto-Tune"
        ],
        correct: [0, 1, 2]
    }
];
// State
let curQuestion = 0;
let userAnswers = [];

// DOM
const questionContainer = document.getElementById("questionContainer");
const submitBtn = document.getElementById("submitBtn");

// Load question
function loadQuestion() {
    const q = questions[curQuestion];

    // Clear old content
    questionContainer.innerHTML = `<h3>${q.question}</h3>`;

    if (q.type === "text") {
        const input = document.createElement("input");
        input.type = "text";
        input.id = "userInput";
        input.placeholder = "Type your answer here...";
        questionContainer.appendChild(input);
    }

    if (q.type === "mc") {
        q.choices.forEach((choice, i) => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="radio" name="mc" value="${i}"> ${choice}`;
            questionContainer.appendChild(label);
            questionContainer.appendChild(document.createElement("br"));
        });
    }

    if (q.type === "multi") {
        q.choices.forEach((choice, i) => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" name="multi" value="${i}"> ${choice}`;
            questionContainer.appendChild(label);
            questionContainer.appendChild(document.createElement("br"));
        });
    }
}

// Save answer
function saveAnswer() {
    const q = questions[curQuestion];
    let answer;

    if (q.type === "text") {
        answer = document.getElementById("userInput").value.trim();
    } 
    else if (q.type === "mc") {
        const selected = document.querySelector("input[name='mc']:checked");
        answer = selected ? parseInt(selected.value) : null;
    } 
    else if (q.type === "multi") {
        answer = Array.from(document.querySelectorAll("input[name='multi']:checked"))
                      .map(input => parseInt(input.value));
    }

    userAnswers.push(answer);
}

// Results
function showResults() {
    let score = 0;
    let html = "";

    questions.forEach((q, i) => {
        const userAnswer = userAnswers[i];
        let correct = false;

        if (q.type === "text") correct = userAnswer.toLowerCase() === q.correct.toLowerCase();
        if (q.type === "mc") correct = userAnswer === q.correct;
        if (q.type === "multi") correct = JSON.stringify((userAnswer || []).sort()) === JSON.stringify(q.correct.sort());

        if (correct) score++;

        html += `<p><strong>${q.question}</strong><br>
                 <span class="${correct ? 'correct' : 'incorrect'}">${correct ? 'Correct' : 'Incorrect'}</span></p><hr>`;
    });

    const passingScore = 3;
    const passFail = score >= passingScore ? 'PASS' : 'FAIL';
    const passFailClass = score >= passingScore ? 'pass' : 'fail';

    questionContainer.innerHTML = `<h2>Total Score: ${score}/${questions.length}</h2>
                                   <h2 class="${passFailClass}">${passFail}</h2>${html}`;

    submitBtn.textContent = "Retake Quiz";
    submitBtn.onclick = resetQuiz;
}

// Reset
function resetQuiz() {
    curQuestion = 0;
    userAnswers = [];
    submitBtn.textContent = "Next Question";
    submitBtn.onclick = nextQuestion;
    loadQuestion();
}

// Next question
function nextQuestion() {
    saveAnswer();
    curQuestion++;

    if (curQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Init
loadQuestion();
submitBtn.onclick = nextQuestion;

// Allow Enter key to submit/advance quiz
document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            submitBtn.click();
        }
    }
);