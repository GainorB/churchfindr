var db = require('../db/config');

const User = {};

User.findByUserName = userName => {
  return db.oneOrNone('SELECT * FROM users WHERE username = $1', [userName]);
};

User.create = user => {
 return db.one(
    `
      INSERT INTO users
      (username, password, phonenumber)
      VALUES ($1, $2, $3) RETURNING *
    `,
    [user.username, user.password, user.phonenumber]
  )
};

module.exports = User;