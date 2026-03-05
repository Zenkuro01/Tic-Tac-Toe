/* ============================= */
/*          Player Object        */
/* ============================= */

function Player(symbol) {
  const getSymbol = () => {
    return symbol;
  };

  return { getSymbol };
}

const Symbol = {
  X: "X",
  O: "O",
};

/* ============================= */
/*        Gameboard Object       */
/* ============================= */

function Gameboard() {
  const board = Array(9).fill(null);

  const getBoard = () => {
    return [...board];
  };

  const getCell = (index) => {
    return board.at(index);
  };

  const isCellEmpty = (index) => {
    return board.at(index) === null;
  };

  const setCell = (index, symbol) => {
    if (!Number.isInteger(index)) {
      console.error("Cell Index not a number");
      return false;
    }

    if (index < 0 || index > 8) {
      console.error("Out of bounds");
      return false;
    }

    if (isCellEmpty(index)) {
      board[index] = symbol;
      return true;
    }

    return false;
  };

  const isBoardFull = () => {
    return !board.includes(null);
  };

  return {
    getBoard,
    getCell,
    setCell,
    isCellEmpty,
    isBoardFull,
  };
}

/* ============================= */
/*           Game Object         */
/* ============================= */

const Game = (function () {
  const playerX = Player(Symbol.X);
  const playerO = Player(Symbol.O);

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

  // Create a Gameboard with an empty board
  const init = () => {
    gameboard = Gameboard();
    currentPlayer = playerX;
  };

  init();

  // Set next Player for the turn
  const switchTurn = () => {
    if (currentPlayer === playerX) currentPlayer = playerO;
    else currentPlayer = playerX;
  };

  // Play next round
  const playRound = (index) => {
    if (gameOver) {
      return "invalid";
    }

    if (!gameboard.setCell(index, currentPlayer.getSymbol())) {
      console.error("The cell must be empty and a number between 0-8");
      return "invalid";
    }

    // Check win condition
    if (checkWin(currentPlayer.getSymbol())) {
      gameOver = true;
      return "win";
    } else {
      // Check draw condition
      if (gameboard.isBoardFull()) {
        gameOver = true;
        return "draw";
      } else {
        switchTurn();
        return "continue";
      }
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

  const getBoard = () => {
    return gameboard.getBoard();
  };

  const isGameOver = () => {
    return gameOver;
  };

  return { playRound, getBoard, isGameOver };
})();

/* ============================= */
/*   DisplayController module    */
/* ============================= */

const DisplayController = (function () {
  const cellElements = document.querySelectorAll(".cell");

  const svgMap = {
    X: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>
        <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>
      </svg>  
    `,
    O: `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="32" stroke="currentColor" stroke-width="12" fill="none"/>
      </svg>
    `,
  };

  const renderBoard = () => {
    const board = Game.getBoard();

    cellElements.forEach((cell) => {
      const index = Number(cell.dataset.index);
      const symbol = board[index];

      cell.innerHTML = svgMap[symbol] || "";
    });
  };

  const handleCellClick = (event) => {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    const response = Game.playRound(index);

    // TODO Render UI based on the response
    console.log(response);

    renderBoard();
  };

  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

  renderBoard();
})();
