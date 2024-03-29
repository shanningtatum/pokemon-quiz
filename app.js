const pokemonQuiz = {};

const maxNumberOfRounds = 5;
const addPoints = 100;
const generatedPokemon = [];
pokemonQuiz.name = {};
pokemonQuiz.pokemonURL = {};
const pokemonOptions = [];
const storeAnswers = [];

const $answer = $(".answer");
const $points = $(".points");
const $progressBar = $(".progressBar");
const $progressContainer = $(".progressTracker");
const $outerProgressBar = $(".outerProgressBar");
const $results = $(".results");
const $button = $(".button");
let arrayIndex;
let correctPokemon;
let $userAnswer;

pokemonQuiz.storeAnswers = [];

pokemonQuiz.trackProgress = {
  rounds: 0,
  userPoints: 0,
  progressBarWidth: 0,
};

// calculates the different scores to display a different final message when users complete the game
pokemonQuiz.score = {
  lowScore: (maxNumberOfRounds * addPoints) / 4,
  mediumScore: (maxNumberOfRounds * addPoints) / 2,
  highScore: maxNumberOfRounds * addPoints,
};

const randomizer = (array) => {
  arrayIndex = Math.floor(Math.random() * array.length);
  return array[arrayIndex];
};

pokemonQuiz.fetchPokemon = function () {
  $.ajax({
    // set a higher limit for a larger array size
    url: `https://pokeapi.co/api/v2/pokemon?limit=256`,
    method: "GET",
    dataType: "json",
  }).then(function (pokemonData) {
    for (i = 0; i < pokemonData.results.length; i++) {
      pokemonQuiz.name = pokemonData.results[i].name;
      pokemonQuiz.pokemonURL = pokemonData.results[i].url;
      generatedPokemon.push({
        name: pokemonQuiz.name,
        url: pokemonQuiz.pokemonURL,
      });
    }
    pokemonQuiz.generateOptions();
  });
};

pokemonQuiz.generateOptions = function () {
  for (i = 0; i < 4; ++i) {
    pokemonOptions[i] = randomizer(generatedPokemon);
    pokemonQuiz.checkPreviousAnswers();

    if (
      pokemonOptions[0] == pokemonOptions[1] &&
      pokemonOptions[0] == pokemonOptions[2] &&
      pokemonOptions[0] == pokemonOptions[3]
    ) {
      pokemonOptions[0] = randomizer(generatedPokemon);
    } else if (
      pokemonOptions[1] == pokemonOptions[0] &&
      pokemonOptions[1] == pokemonOptions[2] &&
      pokemonOptions[1] == pokemonOptions[3]
    ) {
      pokemonOptions[1] = randomizer(generatedPokemon);
    } else if (
      pokemonOptions[2] == pokemonOptions[0] &&
      pokemonOptions[2] == pokemonOptions[1] &&
      pokemonOptions[2] == pokemonOptions[3]
    ) {
      pokemonOptions[2] = randomizer(generatedPokemon);
    } else if (
      pokemonOptions[3] == pokemonOptions[0] &&
      pokemonOptions[3] == pokemonOptions[1] &&
      pokemonOptions[3] == pokemonOptions[2]
    ) {
      pokemonOptions[3] = randomizer(generatedPokemon);
    }
  }

  correctPokemon = randomizer(pokemonOptions);
  storeAnswers.push(correctPokemon);
  console.log(storeAnswers);

  pokemonQuiz.retrieveSprites(correctPokemon.url);
  pokemonQuiz.generateButtons(pokemonOptions);
};

pokemonQuiz.checkPreviousAnswers = function () {
  // this will check that the generated pokemon has not previously been generated to avoid repeats
  for (j = 0; j <= storeAnswers.length; ++j) {
    // console.log(`check store answers loop ${j}`);
    if (pokemonOptions[0] == storeAnswers[j]) {
      pokemonOptions[0] = randomizer(generatedPokemon);

      console.log("This pokemon has already been assigned, reassigning...");
    }
  }
};

pokemonQuiz.retrieveSprites = function (generatedURL) {
  $.ajax({
    url: generatedURL,
    method: "GET",
    dataType: "json",
  }).then(function (pokemonImages) {
    const pokemonImageHTML = `<img class="pokemonImage" src="${pokemonImages.sprites.front_default}" />`;
    $(".pokemon").html(pokemonImageHTML);
  });
};

pokemonQuiz.generateButtons = function () {
  pokemonOptions.forEach((pokemonGenerated) => {
    $(
      `<li class="pokemonOption"><button class="button" type="button">${pokemonGenerated.name.toUpperCase()}</button></li>`
    ).appendTo(".options ul");
  });

  pokemonQuiz.addEventListener();
};

pokemonQuiz.addEventListener = () => {
  $(".button").on("click", function () {
    $userAnswer = $(this).text();
    pokemonQuiz.checkAnswer();
  });
};

pokemonQuiz.checkAnswer = () => {
  pokemonQuiz.trackProgress.rounds = pokemonQuiz.trackProgress.rounds + 1;
  pokemonQuiz.trackProgress.progressBarWidth =
    100 / maxNumberOfRounds + pokemonQuiz.trackProgress.progressBarWidth;
  $progressBar.html(
    `<style> .progressBar:before{width:${pokemonQuiz.trackProgress.progressBarWidth}%} </style>`
  );

  if ($userAnswer.toUpperCase() == correctPokemon.name.toUpperCase()) {
    pokemonQuiz.trackProgress.userPoints =
      pokemonQuiz.trackProgress.userPoints + addPoints;
    $points.html(`<p>POINTS:${pokemonQuiz.trackProgress.userPoints}</p>`);
    $(".pokemonOption").remove();
    event.preventDefault();
  } else {
    $(".pokemonOption").remove();
    event.preventDefault();
  }
  if (pokemonQuiz.trackProgress.rounds == maxNumberOfRounds) {
    pokemonQuiz.endGame();
  } else {
    pokemonQuiz.fetchPokemon();
  }
};

pokemonQuiz.endGame = () => {
  $(".options ul").addClass("active");
  $(".pokemonImage").addClass("active");
  $points.addClass("pointsEndGame");
  $(".nextButton").addClass("active");
  $(".points p").addClass("active");
  $progressBar.addClass("active");
  $progressContainer.addClass("active");
  $outerProgressBar.addClass("active");
  $results.addClass("resultsMessage");

  $(".nextButton").on("click", function () {
    retryButton();
  });

  if (pokemonQuiz.trackProgress.userPoints <= pokemonQuiz.score.lowScore) {
    $results.html(
      `You completed the quiz with ${pokemonQuiz.trackProgress.userPoints} out of ${pokemonQuiz.score.highScore} points. You need to study more!`
    );
  } else if (
    pokemonQuiz.trackProgress.userPoints < pokemonQuiz.score.mediumScore &&
    pokemonQuiz.trackProgress.userPoints > pokemonQuiz.score.lowScore
  ) {
    $results.html(
      `You completed the quiz with ${pokemonQuiz.trackProgress.userPoints} out of ${pokemonQuiz.score.highScore} points. Good job!`
    );
  } else if (
    pokemonQuiz.trackProgress.userPoints == pokemonQuiz.score.highScore ||
    pokemonQuiz.trackProgress.userPoints > pokemonQuiz.score.mediumScore
  ) {
    $results.html(
      `You completed the quiz with ${pokemonQuiz.trackProgress.userPoints} out of ${pokemonQuiz.score.highScore} points. You are a Pokemon Master!`
    );
  }
};

const retryButton = () => {
  pokemonQuiz.trackProgress.userPoints = 0;
  pokemonQuiz.trackProgress.progressBarWidth = 0;
  pokemonQuiz.trackProgress.rounds = 0;
  $points.html(`<p>POINTS:${pokemonQuiz.trackProgress.userPoints}</p>`);
  $progressBar.html(
    `<style> .progressBar:before{width:${pokemonQuiz.trackProgress.progressBarWidth}%} </style>`
  );
  $(".options ul").removeClass("active");
  $(".pokemonImage").removeClass("active");
  $points.removeClass("pointsEndGame");
  $(".nextButton").removeClass("active");
  $(".button").remove();
  $results.html("");
  $results.removeClass("resultsMessage");
  $progressBar.removeClass("active");
  $progressContainer.removeClass("active");
  $outerProgressBar.removeClass("active");

  for (i = 0; i <= storeAnswers.length; i++) {
    storeAnswers.shift();
    storeAnswers.pop();
  }
  pokemonQuiz.fetchPokemon();
};

pokemonQuiz.init = function () {
  pokemonQuiz.fetchPokemon();
};

$(() => {
  pokemonQuiz.init();
});

// PSEUDO CODE
// create a function that can randomize 3 pokemon names
// create a function that generates a pokemon and stores the correct answer
// get a variable that stores the user's answer

// compare users answer with correct answer
// display correct answer to user with message
// each answer is worth 100 points

//display points after 10 rounds
