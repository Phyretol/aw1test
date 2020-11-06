'use strict';

const db = require('./db.js');
const bcrypt = require('bcrypt');

const createTeacher = function (row) {
    const id = row.TeacherId;
    const username = row.Username;
    const hash = row.PasswordHash;
    const course = row.CourseId;
   
    return {id: id, username: username, hash: hash, course: course};
}

exports.getTeacher = function (username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Teacher WHERE Username = ?"
        db.all(sql, [username], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const teacher = createTeacher(rows[0]);
                resolve(teacher);
            }
        });
    });
};

exports.getTeacherById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Teacher WHERE TeacherId = ?"
        db.all(sql, [id], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const teacher = createTeacher(rows[0]);
                resolve(teacher);
            }
        });
    });
};


exports.checkPassword = function(teacher, password){
    /*console.log("hash of: " + password);
    let hash = bcrypt.hashSync(password, 10);
    console.log(hash);
    console.log("DONE");*/
    return bcrypt.compareSync(password, teacher.hash);
}