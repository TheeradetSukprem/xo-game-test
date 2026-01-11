const EMPTY = null;
const PLAYER = 'X';
const BOT = 'O';

const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
};

const isBoardFull = (board) => {
  return board.every(cell => cell !== EMPTY);
};

const getAvailableMoves = (board) => {
  return board.reduce((moves, cell, index) => {
    if (cell === EMPTY) moves.push(index);
    return moves;
  }, []);
};

const minimax = (board, isMaximizing) => {
  const winner = checkWinner(board);

  if (winner === BOT) return 10;
  if (winner === PLAYER) return -10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === EMPTY) {
        board[i] = BOT;
        const score = minimax(board, false);
        board[i] = EMPTY;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === EMPTY) {
        board[i] = PLAYER;
        const score = minimax(board, true);
        board[i] = EMPTY;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const getBotMove = (board) => {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {
    if (board[i] === EMPTY) {
      board[i] = BOT;
      const score = minimax(board, false);
      board[i] = EMPTY;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

const makeMove = (board, position) => {
  if (board[position] !== EMPTY) {
    throw new Error('Invalid move: position already occupied');
  }

  const newBoard = [...board];
  newBoard[position] = PLAYER;

  const playerWon = checkWinner(newBoard);
  if (playerWon) {
    return {
      board: newBoard,
      winner: PLAYER,
      botMove: null,
      gameOver: true
    };
  }

  if (isBoardFull(newBoard)) {
    return {
      board: newBoard,
      winner: null,
      botMove: null,
      gameOver: true
    };
  }

  const botMove = getBotMove(newBoard);
  newBoard[botMove] = BOT;

  const botWon = checkWinner(newBoard);
  if (botWon) {
    return {
      board: newBoard,
      winner: BOT,
      botMove,
      gameOver: true
    };
  }

  if (isBoardFull(newBoard)) {
    return {
      board: newBoard,
      winner: null,
      botMove,
      gameOver: true
    };
  }

  return {
    board: newBoard,
    winner: null,
    botMove,
    gameOver: false
  };
};

module.exports = {
  makeMove,
  checkWinner,
  EMPTY,
  PLAYER,
  BOT
};
