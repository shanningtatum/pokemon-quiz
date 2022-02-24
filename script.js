const pokedex = [
  {
    name: "Abomasnow",
    image: "images/Abomasnow.png",
  },
  {
    name: "Bagon",
    image: "images/Bagon.png",
  },
  {
    name: "Bastiodon",
    image: "images/Bastiodon.png",
  },
  {
    name: "Blastoise",
    image: "images/Blastoise.png",
  },
  {
    name: "Chikorita",
    image: "images/Chikorita.png",
  },
  {
    name: "Darkrai",
    image: "images/Darkrai.png",
  },
  {
    name: "Gardevoir",
    image: "images/Gardevoir.png",
  },
  {
    name: "Growlithe",
    image: "images/Growlithe.png",
  },
  {
    name: "Haunter",
    image: "images/Haunter.png",
  },
  {
    name: "Larvitar",
    image: "images/Larvitar.png",
  },
  {
    name: "Piplup",
    image: "images/Piplup.png",
  },
  {
    name: "Squirtle",
    image: "images/Squirtle.png",
  },
  {
    name: "Tangela",
    image: "images/Tangela.png",
  },
  {
    name: "Vaporeon",
    image: "images/Vaporeon.png",
  },
  {
    name: "Wheezing",
    image: "images/Wheezing.png",
  },
  {
    name: "Wooper",
    image: "images/Wooper.png",
  },
  {
    name: "Ivysaur",
    image: "images/Ivysaur.png",
  },
  {
    name: "Bronzong",
    image: "images/Bronzong.png",
  },
  {
    name: "Riolu",
    image: "images/Riolu.png",
  },
  {
    name: "Sentret",
    image: "images/Sentret.png",
  },
  {
    name: "Voltorb",
    image: "images/Voltorb.png",
  },
  {
    name: "Charmander",
    image: "images/Charmander.png",
  },
  {
    name: "Pikachu",
    image: "images/Pikachu.png",
  },
  {
    name: "Spearow",
    image: "images/Spearow.png",
  },
  {
    name: "Nidoran ♂",
    image: "images/Nidoran-M.png",
  },
  {
    name: "Oddish",
    image: "images/Oddish.png",
  },
  {
    name: "Zubat",
    image: "images/Zubat.png",
  },
];

$(() => {
  const generatedPokemon = [];
  const storeAnswers = [];
  const maxNumberOfRounds = 10;
  const addPoints = 10;

  let correctPokemon;
  let $userAnswer;

  const trackProgress = {
    rounds: 0,
    userPoints: 0,
    progressBarWidth: 0,
  };
  const score = {
    lowScore: (maxNumberOfRounds * addPoints) / 4,
    mediumScore: (maxNumberOfRounds * addPoints) / 2,
    highScore: maxNumberOfRounds * addPoints,
  };

  const $answer = $(".answer");
  const $points = $(".points");
  const $progressBar = $(".progressBar");
  const $results = $(".results");

  const randomizer = (array) => {
    const arrayIndex = Math.floor(Math.random() * array.length);

    return array[arrayIndex];
  };

  const generateRandomPokemon = () => {
    for (i = 0; i < 4; ++i) {
      generatedPokemon[i] = randomizer(pokedex);

      if (generatedPokemon[i] == generatedPokemon[i - 3]) {
        generatedPokemon[i] = randomizer(pokedex);
      } else if (generatedPokemon[i] == generatedPokemon[i - 2]) {
        generatedPokemon[i] = randomizer(pokedex);
      } else if (generatedPokemon[i] == generatedPokemon[i - 1]) {
        generatedPokemon[i] = randomizer(pokedex);
      }
      // this will check that the generated pokemon has not previously been generated to avoid repeats
      for (j = 0; j <= storeAnswers.length; ++j) {
        if (generatedPokemon[i] == storeAnswers[j]) {
          generatedPokemon[i] = randomizer(pokedex);
        }
      }
    }

    correctPokemon = randomizer(generatedPokemon);
    storeAnswers.push(correctPokemon);

    generatedPokemon.forEach((pokemon) => {
      $(
        `<button class="button" type="button">${pokemon.name}</button>`
      ).appendTo(".options");
    });

    // displays the image of the pokemon users have to guess
    const pokemonImageHTML = `<img class="pokemonImage" src="${correctPokemon.image}" />`;
    $(".pokemon").html(pokemonImageHTML);

    // event listener for buttons
    $(".button").on("click", function () {
      $points.removeClass("pointsIncrease");
      $userAnswer = $(this).text();
      checkAnswer();
    });

    return correctPokemon.name;
  };

  generateRandomPokemon();

  const endGame = () => {
    $(".options").addClass("active");
    $(".pokemonImage").addClass("active");
    $points.addClass("pointsEndGame");
    $(".nextButton").addClass("active");
    $("p").addClass("active");
    $progressBar.addClass("active");

    if (trackProgress.userPoints <= score.lowScore) {
      $results.html(
        `You completed the quiz with ${trackProgress.userPoints} out of ${score.highScore} points. You need to study more!`
      );
      $results.addClass("resultsMessage");
      $(".nextButton").on("click", function () {
        retryButton();
      });
    } else if (
      trackProgress.userPoints < score.mediumScore &&
      trackProgress.userPoints > score.lowScore
    ) {
      $results.html(
        `You completed the quiz with ${trackProgress.userPoints} out of ${score.highScore} points. Good job!`
      );
      $results.addClass("resultsMessage");
      $(".nextButton").on("click", function () {
        retryButton();
      });
    } else if (
      trackProgress.userPoints == score.highScore ||
      trackProgress.userPoints > score.mediumScore
    ) {
      $results.html(
        `You completed the quiz with ${trackProgress.userPoints} out of ${score.highScore} points. You are a Pokemon Master!`
      );
      $results.addClass("resultsMessage");
      $(".nextButton").on("click", function () {
        retryButton();
      });
    }
  };

  const checkAnswer = () => {
    trackProgress.rounds = trackProgress.rounds + 1;
    trackProgress.progressBarWidth =
      100 / maxNumberOfRounds + trackProgress.progressBarWidth;
    $progressBar.html(
      `<style> .progressBar:before{width:${trackProgress.progressBarWidth}%} </style>`
    );
    if ($userAnswer == correctPokemon.name) {
      // console.log("You are right!");

      trackProgress.userPoints = trackProgress.userPoints + addPoints;
      $points.html(`<p>POINTS:${trackProgress.userPoints}</p>`);
      $points.addClass("pointsIncrease");
      $userAnswer = "";
      $(".button").remove();
      event.preventDefault();
    } else {
      // console.log("You are wrong!");
      $answer.html(`This is a ${correctPokemon.name}!`);
      $(".button").remove();
      event.preventDefault();
    }
    checkRounds();
    generateRandomPokemon();
  };

  const checkRounds = () => {
    if (trackProgress.rounds == maxNumberOfRounds) {
      endGame();
    }
  };

  const retryButton = () => {
    trackProgress.userPoints = 0;
    trackProgress.progressBarWidth = 0;
    trackProgress.rounds = 0;
    $points.html(`<p>POINTS:${trackProgress.userPoints}</p>`);
    $progressBar.html(
      `<style> .progressBar:before{width:${trackProgress.progressBarWidth}%} </style>`
    );
    $(".options").removeClass("active");
    $(".pokemonImage").removeClass("active");
    $points.removeClass("pointsEndGame");
    $(".nextButton").removeClass("active");
    $(".button").remove();
    $results.html("");
    $results.removeClass("resultsMessage");
    $progressBar.removeClass("active");

    for (i = 0; i <= storeAnswers.length; i++) {
      storeAnswers.shift();
      storeAnswers.pop();
    }
    generateRandomPokemon();
  };
});

// PSEUDO CODE
// create a function that can randomize 3 pokemon names
// create a function that generates a pokemon and stores the correct answer
// get a variable that stores the user's answer

// compare users answer with correct answer
// display correct answer to user with message
// each answer is worth 100 points

//display points after 10 rounds
