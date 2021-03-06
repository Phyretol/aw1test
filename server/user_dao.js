'use strict';

const User = require('./user');
const db = require('./db.js');
const bcrypt = require('bcrypt');

/**
 * Function to create a User object from a row of the users table
 * @param {*} row a row of the users table
 */
const createUser = function (row) {
    const id = row.UserId;
    const name = row.Name;
    const email = row.Email;
    const hash = row.Hash;
   
    return new User(id, name, email, hash);
}

exports.getUser = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM User WHERE Email = ?"
        db.all(sql, [email], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE UserId = ?"
        db.all(sql, [id], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
  };


exports.checkPassword = function(user, password){
    console.log("hash of: " + password);
    let hash = bcrypt.hashSync(password, 10);
    console.log(hash);
    console.log("DONE");

    return bcrypt.compareSync(password, user.hash);
}