var db = require('../db/config');

const User = {};

User.findByUserName = userName => {
  return db.oneOrNone('SELECT * FROM users WHERE username = $1', [userName]);
};

User.create = user => {
 return db.one(
    `
      INSERT INTO users
      (username, firstname, lastname, password, email, phonenumber, street, city, state, country, zip)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
    `,
    [user.username, user.firstname, user.lastname, user.password, user.email, user.phonenumber, user.street, user.city, user.state, user.country, user.zip]
  )
};

module.exports = User;