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

//the variables relating to money
let money = 100;
let bet = 10;
const inputMoney = document.querySelector('input[id="money"]');
const inputBet = document.querySelector('input[id="bet"]');
const formMoney = document.querySelector('form[id="setMoney"]');
const btnSubmitMoney = document.querySelector('input[type="submit"]');
const errorInput = document.querySelector("#errorMessageInput");
const btnRound = document.querySelector('button[id="round"]');

//code starts here
newGame.addEventListener("click", reloadInitial, false);

function reloadInitial() {
  reload();
  sessionStorage.clear();
}

function reload() {
  reload = location.reload();
}

setInitialInput();
function setInitialInput() {
  btnRound.removeEventListener("click", reload);
  //first will try to find out and repopulate the money, if its empty then allow for setting new value for money
  if (sessionStorage.getItem("currentMoney") !== null) {
    console.log("there is sometihng in session storage");
    money = sessionStorage.getItem("currentMoney");
    console.log(money, typeof money);
    money = Number(money);
    console.log(money, typeof money);
    inputMoney.value = money;
    inputMoney.setAttribute("disabled", "disabled");
  }
  formMoney.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("iam printing the money input field: " + inputMoney.value);
    let messages = "";
    if (inputBet.value * 8 >= inputMoney.value) {
      messages =
        "To play proper strategy your bet needs to be 8 times smaller than your current money";
    }
    if (messages.length > 0) {
      errorInput.innerHTML = messages;
    }
    if (messages.length == 0) {
      console.log("i am happy");
      bet = inputBet.value;
      money = inputMoney.value;
      //in the real game i will also disalbe the bet input, remving the submit listener
      // would do that job, but disalbe makes visiallly obvious?
      inputMoney.setAttribute("disabled", "disabled"); //tihs is repeated but i think it's ok
      inputBet.setAttribute("disabled", "disabled");
      console.log(bet, typeof bet);
      console.log(money, typeof money);
      bet = Number(bet);
      money = Number(money);
      console.log(bet, typeof bet, money, typeof money);
      gameSetUp();
    }
  });
}
function gameSetUp() {
  errorInput.innerHTML = "";
  btnSubmitMoney.setAttribute("disabled", "disabled");
  console.log("hi setting up for the game");
  buildDeck();
  shuffleDeck();
  startGame();
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
    //moneyno change
  } else if (dealerBlackJack == true && yourBlackJack == false) {
    money -= bet;
    inputMoney.value = money;
    console.log(money);
    para.textContent = "dealer won blackjack, game over!";
  } else if (dealerBlackJack == false && yourBlackJack == true) {
    money += 1.5 * bet;
    inputMoney.value = money;
    console.log(money);
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
    money -= bet;
    inputMoney.value = money;
    console.log(money);
    message = "You Lose!";
  } else if (dealerSum > 21) {
    message = "You win!";
    money += bet;
    inputMoney.value = money;
    console.log(money);
  }
  //both you and dealer <= 21
  else if (yourSum == dealerSum) {
    message = "Tie!";
  } else if (yourSum > dealerSum) {
    money += bet;
    inputMoney.value = money;
    console.log(money);
    message = "You Win!";
  } else if (yourSum < dealerSum) {
    money -= bet;
    inputMoney.value = money;
    console.log(money);
    message = "You Lose!";
  }

  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("results").innerText = message;

  checkMoneyLeft();
}
function checkMoneyLeft() {
  //8 needed for proper strategy in blackjack assuming smallest bet =1
  if (money <= 8) {
    console.log("you lost: enought money to continue playing");
  } else {
    //integer keys are automatically converted to strings
    saveInSessionStorage();
  }

  function saveInSessionStorage() {
    sessionStorage.clear();
    sessionStorage.setItem("currentMoney", money);
    console.log("do u want a new round?");
    newRound();
  }
}
function newRound() {
  //NOT  sessionStorage.clear();  if sonebosy clicks mutiple times the new round button??? so when correct bet input i tihnk
  btnRound.addEventListener("click", reload);
}

//THIS IS CLUSTER OF FUNCTIONS TO OD WITH CARD RENDERING AND CACLUATING VALUES
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
