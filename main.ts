let quizString: string = `{
    "introText" : "<h1>Quiz arytmetyczny</h1><p>W tym quizie musisz odpowiedzieć na kilka pytań. Odpowiedź na każde z nich jest dodatnią liczbą całkowitą. Twój wynik to czas poświęcony na rozwiązywanie quizu, powiększony o sumę karnych sekund za złe odpowiedzi (każde pytanie ma przypisaną odpowiednią liczbę). Powodzenia!</p>",
    "questions" : [
        {
            "question" : "2 + 2 = ?",
            "answer" : "4",
            "penalty": 1
        },
        {
            "question" : "2 + 3 = ?",
            "answer" : "4",
            "penalty": 1
        },
        {
            "question" : "2 + 4 = ?",
            "answer" : "5",
            "penalty": 1
        },
        {
            "question" : "2 + 5 = ?",
            "answer" : "7",
            "penalty": 1
        }
    ]
}`;

interface IQuestion {
    question: string;
    answer: string;
    penalty: number;
}

interface IQuiz {
    introText: string;
    questions: IQuestion[];
}

let quizObject: IQuiz = JSON.parse(quizString);

let intro: HTMLElement = document.querySelector("div.intro");
let beforeQuiz: HTMLElement = document.querySelector("div.before-quiz");
let quiz: HTMLElement = document.querySelector("div.quiz");
let question: HTMLElement = quiz.querySelector("div.question");
let finishButton: HTMLElement = quiz.querySelector("button.button-finish");
let afterQuiz: HTMLElement = document.querySelector("div.after-quiz");
let questionNumberWrapper: HTMLElement = document.querySelector("div.question-number-wrapper");
let penaltyWrapper: HTMLElement = document.querySelector("div.penalty-wrapper");
let timerWrapper: HTMLElement = document.querySelector("div.timer-wrapper");
let raportElement: HTMLElement = afterQuiz.querySelector("div.raport");
let result: number;

intro.innerHTML = quizObject.introText;

let questionNumber: number;
let questionsNumber: number;
let answers: string[];
let answeredQuestions: number;
let usedTime: number[];
let wholeTime: number;

function startScreen() {
    raportElement.innerHTML = '';
    beforeQuiz.style.display = '';
    quiz.style.display = 'none';
    afterQuiz.style.display = 'none';
    questionNumber = -1;

    let resultsCount = +localStorage.getItem('quiz-results-count');
    let resultsHTMLDiv = document.querySelector('div.best-results');
    resultsHTMLDiv.innerHTML = '';
    if (resultsCount > 0) {
        let results: number[] = [];
        for (let i = 0; i < resultsCount; i++) {
            results[i] = +localStorage.getItem('quiz-result-' + i);
        }
        
        results.sort((a, b) => a - b);
        let listTitle: HTMLElement = document.createElement('div');
        let list: HTMLElement = document.createElement('ol');
        resultsHTMLDiv.appendChild(listTitle);
        resultsHTMLDiv.appendChild(list);
        listTitle.innerText = 'Najlepsze wyniki:';

        for (let i = 0; i < 5 && i < resultsCount; i++) {
            let listElement: HTMLElement = document.createElement('li');
            list.appendChild(listElement);
            listElement.innerText = results[i] + 's';
        }
    }
}

function timer() {
    if (questionNumber != -1) {
        if (!usedTime[questionNumber]) usedTime[questionNumber] = 0;
        usedTime[questionNumber] += 1;
        wholeTime += 1;
        timerWrapper.innerText = 'Spędzony czas: ' + Math.floor(wholeTime / 10) + '.' + (wholeTime % 10) + ' sekund.'
    }
}

startScreen();
setInterval(timer, 100);

function startQuiz() {
    beforeQuiz.style.display = 'none';
    quiz.style.display = '';
    afterQuiz.style.display = 'none';

    answeredQuestions = 0;
    answers = [];
    usedTime = [];
    wholeTime = 0;
    questionNumber = 0;
    questionsNumber = quizObject.questions.length;
    displayQuestion(questionNumber);
}

function finishQuiz() {
    result = wholeTime / 10;
    for (let i = 0; i < questionsNumber; i++) {
        let questionRaport = document.createElement('div');
        raportElement.appendChild(questionRaport);
        questionRaport.innerText = 'Twoja odpowiedź: ' + answers[i] + '; poprawna odpowiedź: ' + quizObject.questions[i].answer;
        if (answers[i] != quizObject.questions[i].answer) {
            result += quizObject.questions[i].penalty;
            questionRaport.innerText += '; Kara za błędną odpowiedź: ' + quizObject.questions[i].penalty;
        }
    }
    quiz.style.display = 'none';
    afterQuiz.style.display = '';
    let resultElement: HTMLElement = afterQuiz.querySelector("div.result");
    resultElement.innerText = 'Twój wynik: ' + result + '.';
}

function returnToStart() {
    let checkbox = document.getElementById('save') as HTMLInputElement;
    if (checkbox.checked) {
        let resultsCount: number = +localStorage.getItem('quiz-results-count');
        localStorage.setItem('quiz-result-' + resultsCount, result.toString());
        resultsCount++;
        localStorage.setItem('quiz-results-count', resultsCount.toString());
    }
    startScreen();
}

function displayQuestion(nr: number) {
    questionNumber = nr;
    beforeQuiz.style.display = 'none';
    quiz.style.display = '';
    question.innerHTML = quizObject.questions[nr].question;

    if (answeredQuestions == questionsNumber) finishButton.style.display = '';
    else finishButton.style.display = 'none';

    questionNumberWrapper.innerText = 'Pytanie nr: ' + (nr + 1);
    penaltyWrapper.innerText = 'Kara za złą odpowiedź: ' + quizObject.questions[nr].penalty;
}

function previousQuestion() {
    let answer = document.getElementById("answer") as HTMLInputElement;
    if (!answers[questionNumber]) answeredQuestions++;
    answers[questionNumber] = answer.value;
    if (!answers[questionNumber]) answeredQuestions--;

    if (questionNumber > 0) {
        questionNumber--;
        if (answers[questionNumber]) answer.value = answers[questionNumber];
        else answer.value = '';
    }
    displayQuestion(questionNumber);
}

function nextQuestion() {
    let answer = document.getElementById("answer") as HTMLInputElement;
    if (!answers[questionNumber]) answeredQuestions++;
    answers[questionNumber] = answer.value;
    if (!answers[questionNumber]) answeredQuestions--;

    if (questionNumber + 1 < questionsNumber) {
        questionNumber++;
        if (answers[questionNumber]) answer.value = answers[questionNumber];
        else answer.value = '';
    }
    displayQuestion(questionNumber);
}