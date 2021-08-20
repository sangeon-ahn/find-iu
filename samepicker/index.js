const $gameBoard = document.querySelector(".game-board");
const $cells = document.querySelectorAll(".table-data");
const $gameStartButton = document.querySelector(".game-start-button");
const $gameRestartButton = document.querySelector(".game-restart-button");
const $time = document.querySelector(".time-left");

const $startSound = document.querySelector(".start-sound");
const $winSound = document.querySelector(".win-sound");
const $loseSound = document.querySelector(".lose-sound");
const $correctSound = document.querySelector(".correct-sound");
const $wrongSound = document.querySelector(".wrong-sound");

const clickedList = [];
const markedCellList = [];
const selectedIndexList = [0, 0, 0, 0, 0, 0, 0, 0];
const CLASS_NAME = {
  displayNone: 'display-none',
  blackBackground: 'black-background'
};
const photoNumber = 8;

let isFirst = true;
let correctCount = 0;
let timerId;
let countdown = 30;

function handleCellClick({ target }) {
  if (markedCellList.includes(target.dataset.index)) {
    return;
  }
  console.log(target);
  target.classList.remove(CLASS_NAME.blackBackground);

  if (isFirst) {
    clickedList.push(target);
    isFirst = false;
    return;
  }

  if (clickedList[clickedList.length - 1].dataset.index === target.dataset.index) {
    return;
  }

  clickedList.push(target);
  isFirst = true;
  checkIfSame();
}

function checkIfSame() {
  const temp = clickedList.length;
  const firstPicture = clickedList[temp - 2];
  const secondPicture = clickedList[temp - 1];
  const samePicture = firstPicture.firstChild.dataset.index === secondPicture.firstChild.dataset.index;

  if (!samePicture) {
    $wrongSound.play();
    setTimeout(() => {
      firstPicture.classList.add(CLASS_NAME.blackBackground);
      secondPicture.classList.add(CLASS_NAME.blackBackground);
    }, 300);

    return;
  }

  $correctSound.play();
  $correctSound.currentTime = 0;
  markedCellList.push(firstPicture.dataset.index);
  markedCellList.push(secondPicture.dataset.index);
  correctCount++;


  if (correctCount === photoNumber) {
    showGemeResult();
  }
}

function showGemeResult() {
  clearInterval(timerId);
  $gameRestartButton.classList.remove(CLASS_NAME.displayNone);

  if (countdown === 1) {
    $loseSound.play();
    return;
  }

  $winSound.play();
}

function setRandomPhoto() {
  const cells = Array.from($cells);
  const cellNumber = cells.length;

  for (let i = 0; i < cellNumber; i++) {
    const number = Math.floor(Math.random() * (photoNumber));

    if (selectedIndexList[number] === 2) {
      i--;
      continue;
    }
    
    selectedIndexList[number]++;
    const image = document.createElement('img');
    image.src = `./image/photo${number + 1}.jpeg`;
    image.dataset.index = number;
    $cells[i].appendChild(image);
  }

  selectedIndexList.length = 0;
}

function handleStartGameButtonClick() {
  setRandomPhoto();

  $startSound.play();
  $gameBoard.classList.remove(CLASS_NAME.displayNone);
  $gameStartButton.classList.add(CLASS_NAME.displayNone);

  timerId = setInterval(() => {
    countdown--;

    if (countdown === 0) {
      showGemeResult();
    }

    $time.textContent = countdown;
  }, 1000);
}

function handleRestartGameButtonClick() {
  $cells.forEach(cell => cell.innerHTML = null);
  setRandomPhoto();
  markedCellList.length = 0;
  correctCount = 0;
  $winSound.pause();
  $winSound.currentTime = 0;
  $gameRestartButton.classList.add(CLASS_NAME.displayNone);

  countdown = 30;
  $time.textContent = countdown;

  timerId = setInterval(() => {
    countdown--;
    if (countdown === 0) {
      showGemeResult();
    }

    $time.textContent = countdown;
  }, 1000);

  $cells.forEach((cell) => {
    cell.classList.add(CLASS_NAME.blackBackground);
  });
}

$cells.forEach((cell) => cell.addEventListener("click", handleCellClick));

$gameStartButton.addEventListener("click", handleStartGameButtonClick);

$gameRestartButton.addEventListener("click", handleRestartGameButtonClick);
