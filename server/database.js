const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

const initDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: {},
      scores: {},
      gameHistory: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
};

const readDB = () => {
  initDB();
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const getOrCreateUser = (userId, email, name) => {
  const db = readDB();

  if (!db.users[userId]) {
    db.users[userId] = {
      id: userId,
      email,
      name,
      created_at: new Date().toISOString()
    };
  }

  if (!db.scores[userId]) {
    db.scores[userId] = {
      user_id: userId,
      score: 0,
      win_streak: 0,
      total_wins: 0,
      total_losses: 0,
      updated_at: new Date().toISOString()
    };
  }

  writeDB(db);
};

const getUserScore = (userId) => {
  const db = readDB();
  const user = db.users[userId];
  const score = db.scores[userId];

  if (!user || !score) {
    return null;
  }

  return {
    user_id: userId,
    name: user.name,
    email: user.email,
    score: score.score,
    win_streak: score.win_streak,
    total_wins: score.total_wins,
    total_losses: score.total_losses,
    updated_at: score.updated_at
  };
};

const getAllScores = () => {
  const db = readDB();
  const scores = [];

  for (const userId in db.scores) {
    const user = db.users[userId];
    const score = db.scores[userId];

    if (user && score) {
      scores.push({
        user_id: userId,
        name: user.name,
        email: user.email,
        score: score.score,
        win_streak: score.win_streak,
        total_wins: score.total_wins,
        total_losses: score.total_losses,
        updated_at: score.updated_at
      });
    }
  }

  scores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.total_wins - a.total_wins;
  });

  return scores;
};

const updateScore = (userId, result) => {
  const db = readDB();
  const score = db.scores[userId] || {
    score: 0,
    win_streak: 0,
    total_wins: 0,
    total_losses: 0
  };

  let newScore = score.score;
  let newWinStreak = score.win_streak;
  let totalWins = score.total_wins;
  let totalLosses = score.total_losses;
  let bonusPoints = 0;

  if (result === 'win') {
    newScore += 1;
    newWinStreak += 1;
    totalWins += 1;

    if (newWinStreak === 3) {
      newScore += 1;
      bonusPoints = 1;
      newWinStreak = 0;
    }
  } else if (result === 'loss') {
    newScore -= 1;
    newWinStreak = 0;
    totalLosses += 1;
  }

  db.scores[userId] = {
    user_id: userId,
    score: newScore,
    win_streak: newWinStreak,
    total_wins: totalWins,
    total_losses: totalLosses,
    updated_at: new Date().toISOString()
  };

  writeDB(db);

  return {
    score: newScore,
    winStreak: newWinStreak,
    totalWins,
    totalLosses,
    bonusPoints
  };
};

const saveGameHistory = (userId, result, boardState) => {
  const db = readDB();

  db.gameHistory.push({
    id: db.gameHistory.length + 1,
    user_id: userId,
    result,
    board_state: boardState,
    played_at: new Date().toISOString()
  });

  writeDB(db);
};

initDB();

module.exports = {
  getOrCreateUser,
  getUserScore,
  getAllScores,
  updateScore,
  saveGameHistory
};
