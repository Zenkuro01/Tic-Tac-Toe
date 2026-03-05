/* ============================= */
/*          Player Object        */
/* ============================= */

function Player(symbol) {
  let score = 0;

  const getSymbol = () => {
    return symbol;
  };

  const increaseScore = () => {
    score++;
  };

  const getScore = () => {
    return score;
  };

  return { getSymbol, increaseScore, getScore };
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
/*           Game Module         */
/* ============================= */

const Game = (function () {
  const GameState = {
    IDLE: "idle",
    PLAYING: "playing",
    WON: "won",
    DRAW: "draw",
  };

  const playerX = Player(Symbol.X);
  const playerO = Player(Symbol.O);

  let gameboard = Gameboard();
  let currentPlayer = null;
  let state = GameState.IDLE;
  let round = 0;

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
  const start = () => {
    gameboard = Gameboard();
    currentPlayer = playerX;
    state = GameState.PLAYING;
    round++;
  };

  // Set next Player for the turn
  const switchTurn = () => {
    if (currentPlayer === playerX) currentPlayer = playerO;
    else currentPlayer = playerX;
  };

  // Play next round
  const playRound = (index) => {
    if (state !== GameState.PLAYING) {
      console.error(
        "The game is already over. Start a new game to continue...",
      );
      return 1;
    }

    const setCellResponse = gameboard.setCell(index, currentPlayer.getSymbol());
    if (!setCellResponse) return 1;

    // Check win condition
    if (checkWin(currentPlayer.getSymbol())) {
      state = GameState.WON;
      currentPlayer.increaseScore();
      return 0;
    } else {
      // Check draw condition
      if (gameboard.isBoardFull()) {
        state = GameState.DRAW;
        return 0;
      } else {
        switchTurn();
        return 0;
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

  const getGameState = () => {
    return state;
  };

  const getRound = () => {
    return round;
  };

  const getPlayersScore = () => {
    return [playerX.getScore(), playerO.getScore()];
  };

  const getTurn = () => {
    if (currentPlayer) return currentPlayer.getSymbol();
    else return null;
  };

  return {
    start,
    playRound,
    getBoard,
    getGameState,
    GameState,
    getRound,
    getPlayersScore,
    getTurn,
  };
})();

/* ============================= */
/*   DisplayController module    */
/* ============================= */

const DisplayController = (function () {
  const cellElements = document.querySelectorAll(".cell");
  const startBtn = document.querySelector("#start-btn");
  const boardElement = document.querySelector(".board");
  const roundNumber = document.querySelector(".round-number");

  const playerX = document.querySelector("#p1");
  const playerO = document.querySelector("#p2");
  const playerXScore = document.querySelector("#ps1");
  const playerOScore = document.querySelector("#ps2");

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

    roundNumber.textContent = Game.getRound();

    const turn = Game.getTurn();

    if (turn === Symbol.X) {
      playerO.classList.remove("active");
      playerX.classList.add("active");
    } else if (turn === Symbol.O) {
      playerX.classList.remove("active");
      playerO.classList.add("active");
    }

    const [scoreX, scoreO] = Game.getPlayersScore();
    playerXScore.textContent = scoreX;
    playerOScore.textContent = scoreO;
  };

  const handleStartBtnClick = () => {
    startBtn.classList.toggle("hidden");
    boardElement.classList.toggle("enabled");

    Game.start();
    renderBoard();
  };

  const handleCellClick = (event) => {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    if (Game.getGameState() === Game.GameState.PLAYING) {
      Game.playRound(index);

      if (Game.getGameState() !== Game.GameState.PLAYING) {
        startBtn.classList.toggle("hidden");
        boardElement.classList.toggle("enabled");
      }

      renderBoard();
    }
  };

  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

  startBtn.addEventListener("click", handleStartBtnClick);

  renderBoard();
})();
