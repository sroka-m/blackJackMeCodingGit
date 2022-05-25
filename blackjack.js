let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let dealerUpperCard; //professional tables, hit.stay based on dealer upper card
let hidden;

let deck;

let dealerBlackJack = false;
let yourBlackJack = false;

let canHit = true; //allows the player (you) to draw while yourSum <= 21
//u need to defer for these constants NOT to be null
const para = document.querySelector("#results");
const dealerContainer = document.querySelector("#dealer-cards");
const yourContainer = document.querySelector("#your-cards");
const newGame = document.querySelector("#reload");

window.onload = function () {
  console.log(newGame);
  newGame.addEventListener("click", reload, false);
  buildDeck();
  shuffleDeck();
  startGame();
};
// Reload everything:
function reload() {
  reload = location.reload();
}

function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];
  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
    }
  }
  // console.log(deck);
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck);
}

function startGame() {
  //getting your initial 2 cards,  if u got blackjack, then check with dealer and game over
  for (let i = 0; i < 2; i++) {
    let card = deck.pop();
    renderCard(card, yourContainer);
    //need inside,  card does not exist elswhere
    yourSum += getValue(card);
    console.log(yourSum);
    yourAceCount += checkAce(card);
    console.log(yourAceCount);
    //i dont need to invoke reduceAceCount here
    // reduceAce(yourSum, yourAceCount);
    // console.log(yourSum);
  }
  if (yourSum == 21) {
    yourBlackJack = true;
  }
  //getting dealers two cards
  hidden = deck.pop();
  dealerUpperCard = deck.pop();
  renderCard(dealerUpperCard, dealerContainer);
  dealerSum += getValue(hidden);
  console.log(dealerSum);
  dealerSum += getValue(dealerUpperCard);
  console.log(dealerSum);
  dealerAceCount += checkAce(hidden);
  dealerAceCount += checkAce(dealerContainer);
  console.log(dealerAceCount);
  if (dealerSum == 21) {
    dealerBlackJack = true;
  }
  checkIfWonBlackjack();
}

function checkIfWonBlackjack() {
  if (dealerBlackJack == true && yourBlackJack == true) {
    para.textContent =
      "both you and the dealer have bleackjack, tie! Game over!";
  } else if (dealerBlackJack == true && yourBlackJack == false) {
    para.textContent = "dealer won blackjack, game over!";
  } else if (dealerBlackJack == false && yourBlackJack == true) {
    para.textContent = "you won blackjack, game over!";
  } else {
    mainGame();
  }
}
function mainGame() {
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
}
function hit() {
  if (!canHit) {
    return;
  }
  let card = deck.pop();
  renderCard(card, yourContainer);
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  if (reduceAce(yourSum, yourAceCount) > 21) {
    console.log("hi iam here");
    //A, J, 8 -> 1 + 10 + 8
    canHit = false;
  }
}

function stay() {
  yourSum = reduceAce(yourSum, yourAceCount);
  canHit = false;
  dealerDrawsCards();
}

function dealerDrawsCards() {
  document.getElementById("hidden").src = "./cards/" + hidden + ".png";
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  while (dealerSum < 17) {
    //<img src="./cards/4-C.png">
    let card = deck.pop();
    renderCard(card, dealerContainer);
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    // dealerSum = reduceAce(dealerSum, dealerAceCount); wft is equal here?????
  }
  console.log(dealerSum);
  whoWon();
}
function whoWon() {
  let message = "";
  if (yourSum > 21) {
    message = "You Lose!";
  } else if (dealerSum > 21) {
    message = "You win!";
  }
  //both you and dealer <= 21
  else if (yourSum == dealerSum) {
    message = "Tie!";
  } else if (yourSum > dealerSum) {
    message = "You Win!";
  } else if (yourSum < dealerSum) {
    message = "You Lose!";
  }

  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("results").innerText = message;
}

function renderCard(card, container) {
  let cardImg = document.createElement("img");
  cardImg.src = "./cards/" + card + ".png";
  container.append(cardImg);
}

function getValue(card) {
  let data = card.split("-"); // "4-C" -> ["4", "C"]
  let value = data[0];

  if (isNaN(value)) {
    if (value == "A") {
      return 11;
    }
    return 10;
  }
  //console.log(value);
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  }
  return 0;
}

function reduceAce(playerSum, playerAceCount) {
  //it works, if  get 9 and A in the first 2 cards then we will not hit
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}
