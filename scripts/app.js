"use strict";

const triviaAmountInput = document.getElementById("trivia_amount");
let triviaAmount = 20;
let triviaCategory = document.getElementById("trivia_category").value;
let triviaDifficulty = document.getElementById("trivia_difficulty").value;
const startBtn = document.getElementById("startBtn");
let correctAnswers;

$("form").submit(function (e) {
  e.preventDefault();
});

triviaAmountInput.addEventListener("input", function () {
  const minValue = 1;
  const maxValue = 50;
  let inputValue = parseFloat(this.value);
  triviaAmount = isNaN(inputValue) || inputValue < minValue ? minValue : Math.min(parseInt(this.value), maxValue);
  // console.log(triviaAmount);
});

startBtn.addEventListener("click", () => {
  getTriviaData()
    .then((data) => {
      displayTrivia(data.results);
      getCorrectAnswers(data.results);
    })
    .catch((error) => {
      console.error("Error fetching games data:", error);
    });
});

async function getTriviaData() {
  try {
    $(".loader").removeClass("d-none");
    let response = await fetch(
      `https://opentdb.com/api.php?amount=${triviaAmount}&category=${triviaCategory}&difficulty=${triviaDifficulty}&type=multiple`
    );
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    let triviaData = await response.json();
    // displayTrivia(triviaData);
    // console.log(triviaData);
    return triviaData;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  } finally {
    $(".loader").addClass("d-none");
  }
}

function displayTrivia(data) {
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  if (data) {
    let dataContainer = "";
    let answers;
    let answersShuffle = [0, 1, 2, 3];
    for (let i = 0; i < data.length; i++) {
      answers = [data[i].correct_answer, ...data[i].incorrect_answers];
      shuffleArray(answersShuffle);
      dataContainer += `
        <div data-questionNumber="${
          i + 1
        }" class="p-4 rounded-3 shadow-sm mb-3">
        <!-- Question -->
        <div class="question">
          <p><span>${i + 1}) </span>${data[i].question}</p>
        </div>
        <!-- Answers -->
        <div class="answers">
          <div class="form-check">
            <label>
              <input class="form-check-input" type="radio" name="answerQ${
                i + 1
              }" value="1" data-questionNumber="${i + 1}">
              ${answers[answersShuffle[0]]}
          </label>
          </div>
          <div class="form-check">
            <label>
              <input class="form-check-input" type="radio" name="answerQ${
                i + 1
              }" value="2" data-questionNumber="${i + 1}">
              ${answers[answersShuffle[1]]}
          </label>
          </div>
          <div class="form-check">
            <label>
              <input class="form-check-input" type="radio" name="answerQ${
                i + 1
              }" value="3" data-questionNumber="${i + 1}">
              ${answers[answersShuffle[2]]}
          </label>
          </div>
          <div class="form-check">
            <label>
              <input class="form-check-input" type="radio" name="answerQ${
                i + 1
              }" value="4" data-questionNumber="${i + 1}">
              ${answers[answersShuffle[3]]}
          </label>
          </div>

          <div class="showCorrectAnswer mt-3 d-none">
          <span class="correctAnswer badge text-bg-info">Correct Answer is:</span>
          </div>
        </div>
        </div>
        `;
    }
    document.getElementById("quizContainer").innerHTML = dataContainer;
    $(".settings").addClass("d-none");
    $(".quiz").removeClass("d-none");
  }
}

function getCorrectAnswers(data) {
  correctAnswers = data.map((e) => e.correct_answer);
}

function getUserAnswers() {
  const questions = document.querySelectorAll(
    "#quizContainer div[data-questionNumber]"
  );

  document.querySelectorAll('input[type="radio"]').forEach(input => input.disabled = true);

  questions.forEach((question) => {
    const questionNumber = question.getAttribute("data-questionNumber");
    const answers = Array.from(
      question.querySelectorAll('.answers input[type="radio"]')
    );
    // console.log(`Question: ${questionNumber}`);

    if (answers.every((answer) => !answer.checked)) {
      question.classList.add("wrongAnswer");
      showCorrectAnswer(questionNumber);
    } else {
      answers.forEach((answer) => {
        if (answer.checked) {
          checkAnswer(answer);
        }
      });
    }
  });
}

function checkAnswer(answer) {
  let choosedAnswer = answer.parentElement.textContent.trim();
  let questionNumber = answer.getAttribute("data-questionNumber");
  let correctAnswer = correctAnswers[questionNumber-1];
  if (choosedAnswer === correctAnswer){
    $(`div[data-questionNumber=${questionNumber}]`).addClass("correctAnswer");
  }
  else{
    $(`div[data-questionNumber=${questionNumber}]`).addClass("wrongAnswer");
    showCorrectAnswer(questionNumber);
  }
//   console.log(correctAnswers);
//   console.log(choosedAnswer);
//   console.log(correctAnswer);
//   console.log(answer);
}

function showCorrectAnswer(questionNumber) {
    let questionElement = document.querySelector(`#quizContainer div[data-questionNumber="${questionNumber}"]`);
    let showCorrectAnswerElement = questionElement.querySelector(`.showCorrectAnswer`);
    let sorrectAnswerSpanElement = questionElement.querySelector(`.showCorrectAnswer .correctAnswer`);
    sorrectAnswerSpanElement.innerHTML = `Correct Answer is: ${correctAnswers[questionNumber-1]}`;
    showCorrectAnswerElement.classList.remove("d-none");
    // console.log(question, "showCorrectAnswer");
}

function showResult(){
    let noOfCorrectAnswers = document.querySelectorAll("div[data-questionnumber].correctAnswer").length;
    document.querySelector("#quizScore").innerHTML = `You Score is: ${noOfCorrectAnswers} / ${triviaAmount}`;
    $("#quizResult").removeClass("d-none");
    $(window).scrollTop(0);
}