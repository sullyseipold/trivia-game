var gameNum;
var numOfQuestions;
var currentQuestionNum;
var rightAnswers;
var wrongAnswers;
var gameArray;
var correctAnswer;
var currentQuestion;
var currentAnswers;
var intervalId;
var clockRunning;
var timeRemaining;
var getUrl = "https://opentdb.com/api.php?amount=10&category=18";


function initializeGame() {

    $('.answer-group').empty();
    numOfQuestions = 0;
    currentQuestionNum = 0;
    rightAnswers = 0;
    wrongAnswers = 0;
    gameArray = [];
    correctAnswer = "";
    currentQuestion = {};
    currentAnswers = [];

    resetClock();

    $.get(getUrl).then(function (response) {
        gameArray = response.results;
        numOfQuestions = gameArray.length;

    });


    $('.results-view').addClass('hidden');
    $('#clock').addClass('hidden');
    $('.game-view').removeClass('hidden');
    $('#start-btn').removeClass('hidden');
    $('#correct-text').empty();
    $('.answer-group').empty();
    $('#question-text').empty();

};

function startClock() {
    if (!clockRunning) {
        $('#clock').removeClass('hidden');
        count();
        intervalId = setInterval(count, 1000);
        clockRunning = true;
    };
};

function stopClock() {
    clearInterval(intervalId);
    clockRunning = false;
};

function resetClock() {
    stopClock();
    timeRemaining = 30;
    $('#time-remaining').text(timeRemaining);
};

function count() {
    if (timeRemaining > 0) {
        timeRemaining--;
        $('#time-remaining').text(timeRemaining);
    }
    else {
        resetClock();
        answerQuestion(null);
    }
};

function displayCorrectAnswer() {
    var answer = "";

    $('.answer-item').filter(function () {
        return $(this).attr('selected-answer') !== 'true';
    }).addClass('invisible');

    $('#correct-text').append('<h2>CORRECT!!</h2>');

};

function displayWrongAnswer() {
    var answer = "";

    if (($('.answer-item').attr('selected-answer')) == 'true') {
    };

    $('#correct-text').append('<h2>WRONG!!</h2>');
    $('#correct-text').append(`<h4>Correct answer is: ${correctAnswer} </h4>`);
    $('.answer-item').addClass('hidden');

};

function displayGameResults() {
    resetClock();
    $('.game-view').addClass('hidden');
    $('#right-answers').text(rightAnswers);
    $('#wrong-answers').text(wrongAnswers);
    $('.results-view').removeClass('hidden');



};

$('#new-game-btn').on('click', function (event) {
    initializeGame();
});

function startGame() {
};

//load the next question
function nextQuestion() {

    currentQuestion = gameArray[currentQuestionNum];
    correctAnswer = decodeURI(currentQuestion.correct_answer);
    currentAnswers = currentQuestion.incorrect_answers.map(item => { return decodeURIComponent(item) });

    $('#correct-text').empty();
    $('.answer-group').empty();

    if (gameArray[currentQuestionNum].type.toLowerCase() == 'boolean') {
        var li1 = $('<a>').addClass('list-group-item list-group-item-action list-group-item-light answer-item').html('TRUE').attr('href', '#');
        var li2 = $('<a>').addClass('list-group-item list-group-item-action list-group-item-light answer-item').html('FALSE').attr('href', '#');

        $('.answer-group').append(li1);
        $('.answer-group').append(li2);
    }
    else {
        var answerIndex = Math.floor(Math.random() * currentAnswers.length);
        currentAnswers.splice(answerIndex, null, correctAnswer);

        currentAnswers.map(item => {
            var answ = $('<a>').addClass('list-group-item list-group-item-action list-group-item-light answer-item').html(item).attr('href', '#');
            $('.answer-group').append(answ);
        });
    };

    $('#question-text').html(currentQuestion.question);
    startClock();
};

//SELECT AN ANSWER
$(document).on('click', '.answer-item', function (event) {
    answerQuestion($(this));
});


function answerQuestion(selection) {

    if (selection) {
        if (selection.text().toLowerCase() == correctAnswer.toLowerCase()) {
            rightAnswers++;
            selection.attr('selected-answer', 'true').addClass('disabled');
            displayCorrectAnswer();
        }
        else {
            wrongAnswers++;
            displayWrongAnswer();
        }
    } else {
        wrongAnswers++;
        displayWrongAnswer();
    };

    if (currentQuestionNum < (numOfQuestions - 1)) {
        currentQuestionNum++;
        resetClock();

        var delayNextQuestion = setTimeout(function () {
            nextQuestion();
        }, 3000);
    }
    else {
        displayGameResults();
    }
};


$('#start-btn').on('click', function (event) {

    if (currentQuestionNum < numOfQuestions) {
        nextQuestion();
        $(this).addClass('hidden');
    };
});

$('#new-game-btn').on('click', function (event) {
    initializeGame();
});

initializeGame();