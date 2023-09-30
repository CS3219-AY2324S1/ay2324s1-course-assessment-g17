import db from "./db";

export enum QuestionComplexityEnum {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export enum MatchStatusEnum {
  MATCHED = "Matched",
  PENDING = "Pending",
  TIMEOUT = "Timeout",
}

interface MatchingInfo {
  user_id: number;
  socket_id: string;
  difficulty_level: QuestionComplexityEnum[];
  topics: string[];
  status: MatchStatusEnum;
}

export const createMatchingTable = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE matching (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      socket_id TEXT,
      difficulty_level TEXT,
      topics TEXT,
      status TEXT
    )`);
  });
};

export const insertMatchingInfo = (info: MatchingInfo) => {
  db.run(
    `INSERT INTO matching (user_id, socket_id, difficulty_level, topics, status)
     VALUES (?, ?, ?, ?)`,
    [
      info.user_id,
      info.socket_id,
      info.difficulty_level,
      info.topics,
      info.status,
    ],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    },
  );
};

export const getMatchingInfo = (userId: number) => {
  db.all(
    `SELECT * FROM matching WHERE user_id = ?`,
    [userId],
    (err, rows: MatchingInfo[]) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        console.log(row);
      });
    },
  );
};

export const updateMatchingStatus = (id: number, newStatus: string) => {
  db.run(
    `UPDATE matching SET status = ? WHERE id = ?`,
    [newStatus, id],
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row ${id} updated successfully`);
    },
  );
};
