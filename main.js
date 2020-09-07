var quizString = "{\n    \"introText\" : \"<h1>Quiz arytmetyczny</h1><p>W tym quizie musisz odpowiedzie\u0107 na kilka pyta\u0144. Odpowied\u017A na ka\u017Cde z nich jest dodatni\u0105 liczb\u0105 ca\u0142kowit\u0105. Tw\u00F3j wynik to czas po\u015Bwi\u0119cony na rozwi\u0105zywanie quizu, powi\u0119kszony o sum\u0119 karnych sekund za z\u0142e odpowiedzi (ka\u017Cde pytanie ma przypisan\u0105 odpowiedni\u0105 liczb\u0119). Powodzenia!</p>\",\n    \"questions\" : [\n        {\n            \"question\" : \"2 + 2 = ?\",\n            \"answer\" : \"4\",\n            \"penalty\": 1\n        },\n        {\n            \"question\" : \"2 + 3 = ?\",\n            \"answer\" : \"4\",\n            \"penalty\": 1\n        },\n        {\n            \"question\" : \"2 + 4 = ?\",\n            \"answer\" : \"5\",\n            \"penalty\": 1\n        },\n        {\n            \"question\" : \"2 + 5 = ?\",\n            \"answer\" : \"7\",\n            \"penalty\": 1\n        }\n    ]\n}";
var quizObject = JSON.parse(quizString);
var intro = document.querySelector("div.intro");
var beforeQuiz = document.querySelector("div.before-quiz");
var quiz = document.querySelector("div.quiz");
var question = quiz.querySelector("div.question");
var finishButton = quiz.querySelector("button.button-finish");
var afterQuiz = document.querySelector("div.after-quiz");
var questionNumberWrapper = document.querySelector("div.question-number-wrapper");
var penaltyWrapper = document.querySelector("div.penalty-wrapper");
var timerWrapper = document.querySelector("div.timer-wrapper");
var raportElement = afterQuiz.querySelector("div.raport");
var result;
intro.innerHTML = quizObject.introText;
var questionNumber;
var questionsNumber;
var answers;
var answeredQuestions;
var usedTime;
var wholeTime;
function startScreen() {
    raportElement.innerHTML = '';
    beforeQuiz.style.display = '';
    quiz.style.display = 'none';
    afterQuiz.style.display = 'none';
    questionNumber = -1;
    var resultsCount = +localStorage.getItem('quiz-results-count');
    var resultsHTMLDiv = document.querySelector('div.best-results');
    resultsHTMLDiv.innerHTML = '';
    if (resultsCount > 0) {
        var results = [];
        for (var i = 0; i < resultsCount; i++) {
            results[i] = +localStorage.getItem('quiz-result-' + i);
        }
        results.sort(function (a, b) { return a - b; });
        var listTitle = document.createElement('div');
        var list = document.createElement('ol');
        resultsHTMLDiv.appendChild(listTitle);
        resultsHTMLDiv.appendChild(list);
        listTitle.innerText = 'Najlepsze wyniki:';
        for (var i = 0; i < 5 && i < resultsCount; i++) {
            var listElement = document.createElement('li');
            list.appendChild(listElement);
            listElement.innerText = results[i] + 's';
        }
    }
}
function timer() {
    if (questionNumber != -1) {
        if (!usedTime[questionNumber])
            usedTime[questionNumber] = 0;
        usedTime[questionNumber] += 1;
        wholeTime += 1;
        timerWrapper.innerText = 'Spędzony czas: ' + Math.floor(wholeTime / 10) + '.' + (wholeTime % 10) + ' sekund.';
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
    for (var i = 0; i < questionsNumber; i++) {
        var questionRaport = document.createElement('div');
        raportElement.appendChild(questionRaport);
        questionRaport.innerText = 'Twoja odpowiedź: ' + answers[i] + '; poprawna odpowiedź: ' + quizObject.questions[i].answer;
        if (answers[i] != quizObject.questions[i].answer) {
            result += quizObject.questions[i].penalty;
            questionRaport.innerText += '; Kara za błędną odpowiedź: ' + quizObject.questions[i].penalty;
        }
    }
    quiz.style.display = 'none';
    afterQuiz.style.display = '';
    var resultElement = afterQuiz.querySelector("div.result");
    resultElement.innerText = 'Twój wynik: ' + result + '.';
}
function returnToStart() {
    var checkbox = document.getElementById('save');
    if (checkbox.checked) {
        var resultsCount = +localStorage.getItem('quiz-results-count');
        localStorage.setItem('quiz-result-' + resultsCount, result.toString());
        resultsCount++;
        localStorage.setItem('quiz-results-count', resultsCount.toString());
    }
    startScreen();
}
function displayQuestion(nr) {
    questionNumber = nr;
    beforeQuiz.style.display = 'none';
    quiz.style.display = '';
    question.innerHTML = quizObject.questions[nr].question;
    if (answeredQuestions == questionsNumber)
        finishButton.style.display = '';
    else
        finishButton.style.display = 'none';
    questionNumberWrapper.innerText = 'Pytanie nr: ' + (nr + 1);
    penaltyWrapper.innerText = 'Kara za złą odpowiedź: ' + quizObject.questions[nr].penalty;
}
function previousQuestion() {
    var answer = document.getElementById("answer");
    if (!answers[questionNumber])
        answeredQuestions++;
    answers[questionNumber] = answer.value;
    if (!answers[questionNumber])
        answeredQuestions--;
    if (questionNumber > 0) {
        questionNumber--;
        if (answers[questionNumber])
            answer.value = answers[questionNumber];
        else
            answer.value = '';
    }
    displayQuestion(questionNumber);
}
function nextQuestion() {
    var answer = document.getElementById("answer");
    if (!answers[questionNumber])
        answeredQuestions++;
    answers[questionNumber] = answer.value;
    if (!answers[questionNumber])
        answeredQuestions--;
    if (questionNumber + 1 < questionsNumber) {
        questionNumber++;
        if (answers[questionNumber])
            answer.value = answers[questionNumber];
        else
            answer.value = '';
    }
    displayQuestion(questionNumber);
}
