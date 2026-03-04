/* ============================= */
/*          Player Object        */
/* ============================= */

function Player(symbol) {
  const getSymbol = () => {
    return symbol;
  };

  return { getSymbol };
}

/* ============================= */
/*        Gameboard Object       */
/* ============================= */

function Gameboard(board) {
  const gameboard = board;

  const displayGameboard = () => {
    console.log(`Current board:`, gameboard);
  };

  const getCell = (index) => {
    return gameboard.at(index);
  };

  const setCell = (index, symbol) => {
    if (!Number.isInteger(index)) {
      console.error("Cell Index not a number");
    }

    if (index < 0 || index > 8) {
      console.error("Out of bounds");
      return false;
    }

    if (isCellEmpty(index)) {
      gameboard[index] = symbol;
      return true;
    } else return false;
  };

  const isCellEmpty = (index) => {
    return gameboard.at(index) === null;
  };

  const isGameboardFull = () => {
    return !gameboard.includes(null);
  };

  return { displayGameboard, getCell, setCell, isCellEmpty, isGameboardFull };
}

/* ============================= */
/*           Game Object         */
/* ============================= */

function Game(playerX, playerO) {
  let gameboard = null;
  let currentPlayer = null;
  let gameOver = false;
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Create empty Gameboard
  const start = () => {
    gameboard = Gameboard(Array(9).fill(null));
    currentPlayer = playerX;

    console.log("The game is starting.");
    gameboard.displayGameboard();
  };

  // Set next Player for the turn
  const switchTurn = () => {
    if (currentPlayer == playerX) currentPlayer = playerO;
    else currentPlayer = playerX;
  };

  // Play next round
  const playRound = (index) => {
    if (gameOver) {
      console.log("The game is already over. Please start a new game.");
      return 0;
    }

    console.log(`Player's ${currentPlayer.getSymbol()} turn.`);

    if (!gameboard.setCell(index, currentPlayer.getSymbol())) {
      console.error("The cell must be empty and a number between 0-8");
      return 1;
    }

    console.log("Symbol placed.");
    gameboard.displayGameboard();

    // Check win/draw condition
    if (checkWin(currentPlayer.getSymbol())) {
      console.log(`Player ${currentPlayer.getSymbol()} Won!!!`);
      gameOver = true;
    } else {
      if (checkDraw()) {
        console.log("It's a draw.");
        gameOver = true;
      } else switchTurn();
    }
  };

  const checkWin = (symbol) => {
    for (const pattern of winningPatterns) {
      const [a, b, c] = pattern;

      if (
        gameboard.getCell(a) === symbol &&
        gameboard.getCell(b) === symbol &&
        gameboard.getCell(c) === symbol
      ) {
        return true;
      }
    }

    return false;
  };

  const checkDraw = () => {
    return gameboard.isGameboardFull();
  };

  const isGameOver = () => {
    return gameOver;
  };

  return { playRound, start, isGameOver };
}

/* ============================= */
/*          Code execution       */
/* ============================= */

const playerX = Player("X");
const playerO = Player("O");

const game = Game(playerX, playerO);
game.start();

// while (!game.isGameOver()) {
//   game.playRound(Math.floor(Math.random() * 9));
// }

// stopping after some iterations to avoid infinity loops in testing
let i = 0;
while (!game.isGameOver() && i <= 200) {
  game.playRound(Math.floor(Math.random() * 9));
  i++;
}
