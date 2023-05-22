var $ = jQuery; // eslint-disable-line
$(function () {
  let showLevel = 1;
  let usedImages = [];
  let cardCounter = 0;
  let pickedCards = [];
  let images = [
    "img/1.png",
    "img/2.png",
    "img/3.png",
    "img/4.png",
    "img/5.png",
    "img/6.png",
    "img/7.png",
    "img/8.png",
    "img/9.png",
    "img/10.png",
    "img/11.png",
    "img/12.png",
    "img/13.png",
    "img/14.png",
    "img/15.png",
    "img/16.png",
    "img/17.png",
    "img/18.png",
    "img/19.png",
    "img/20.png",
    "img/21.png"
  ];
  let currentLevel = 1;
  let scoresData = {
    level1: [
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"]
    ],
    level2: [
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"]
    ],
    level3: [
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"]
    ],
    level4: [
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"]
    ],
    level5: [
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"]
    ],
    level6: [
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"],
      ["---", "-----"]
    ]
  };
  let cards = [];
  let moves = 0;
  let movesCounter = document.querySelector(".moves");
  let size = 16;
  // Shuffle algorithm
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ];
    }
    return array;
  }
  // Function for starting/restarting game
  function startGame() {
    pickedCards = [];
    usedImages = [];
    cardCounter = 0;
    for (let i = 0; i < size / 2; i++) {
      usedImages.push(images[i]);
      usedImages.push(images[i]);
    }
    usedImages = shuffle(usedImages);
    cards = shuffle(cards);
    for (let i = 0; i < usedImages.length; i++) {
      $(".cards").append(
        "<li class='card'><img class='back' src=" +
          usedImages[i] +
          "><img class='front' src='img/black.png'></li>"
      );
    }
    moves = 0;
    movesCounter.innerHTML = moves + " Moves";
  }
  function delegate() {
    $(".cards").delegate("li", "click", function () {
      $(this).toggleClass("picked");
      pickCard(this);
    });
  }
  startGame();
  delegate();
  // Picking cards
  function pickCard(element) {
    pickedCards.push(element);
    if (pickedCards.length === 2) {
      $("ul").toggleClass("blocked");
      moves++;
      movesCounter.innerHTML = moves + " Moves";
      if (pickedCards[0].innerHTML === pickedCards[1].innerHTML) {
        setTimeout(sameCards, 1000);
      } else {
        setTimeout(differentCards, 1000);
      }
    }
  }
  function sameCards() {
    $(pickedCards[0]).toggleClass("same blocked picked");
    $(pickedCards[1]).toggleClass("same blocked picked");
    pickedCards = [];
    cardCounter = cardCounter + 2;
    $("ul").toggleClass("blocked");
    if (cardCounter === usedImages.length) {
      $(".overlay, .popup, .finish").toggleClass("show");
      $(".movesPopup").html(moves);
    }
  }
  function differentCards() {
    $(pickedCards[0]).toggleClass("picked");
    $(pickedCards[1]).toggleClass("picked");
    pickedCards = [];
    $("ul").toggleClass("blocked");
  }
  //Algorithm for calculating ranking
  function updateRank(array) {
    for (var i = 0; i < array.length; i++) {
      if (moves < array[i][0] || array[i][0] === "---") {
        for (var ii = i; ii === array.length; ii++) {
          array[ii + 1] = array[ii];
        }
        array[i] = [moves, $(".input").val()];
        break;
      }
    }
  }
  function checkArray(level) {
    switch (level) {
      case 1:
        return scoresData.level1;
      case 2:
        return scoresData.level2;
      case 3:
        return scoresData.level3;
      case 4:
        return scoresData.level4;
      case 5:
        return scoresData.level5;
      case 6:
        return scoresData.level6;
    }
  }
  //Showing scores
  function showScores(array) {
    for (let i = 0; i < 5; i++) {
      $(".scoresList").append(
        "<li class='score'><span>" +
          (i + 1) +
          "." +
          "</span><span>" +
          array[i][1] +
          "</span><span>" +
          array[i][0] +
          "</span></li>"
      );
      $(".currLevel").html(showLevel);
    }
  }

  // Click events
  //Main panel
  $(".restart").click(function () {
    $(".card").remove();
    startGame();
  });
  $(".highscores").click(function () {
    showLevel = currentLevel;
    showScores(checkArray(showLevel));
    $(".overlay, .popup, .scores").toggleClass("show");
  });
  $(".leftButton").click(function () {
    $(".score").remove();
    if (showLevel !== 1) {
      showLevel--;
    }
    showScores(checkArray(showLevel));
  });
  $(".rightButton").click(function () {
    $(".score").remove();
    if (showLevel !== 6) {
      showLevel++;
    }
    showScores(checkArray(showLevel));
  });
  $(".download").click(function () {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(scoresData))
    );
    element.setAttribute("download", "highscore.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  });
  // Level panel
  $(".levelPanel")
    .find("button")
    .click(function () {
      var $this = $(this);
      currentLevel = $this.data("level");
      size = $this.data("size");
      let width = $this.data("width");
      $(".cards").css("grid-template-columns", "repeat(" + width + ",1fr)");
      $(".card").remove();
      startGame();
    });
  //Finish panel
  $(".input").click(function () {
    $(".input").val("");
  });
  $(".again").click(function () {
    $(".card").remove();
    startGame();
    $(".overlay, .popup, .finish").toggleClass("show");
  });
  $(".finishScores").click(function () {
    updateRank(checkArray(currentLevel));
    showLevel = currentLevel;
    showScores(checkArray(showLevel));
    $(".finish").removeClass("show");
    $(".scores").addClass("show");
  });
  $(".close").click(function () {
    $(".score").remove();
    $(".overlay, .popup, .scores").toggleClass("show");
  });
});
