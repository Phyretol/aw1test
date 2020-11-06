'use strict';

const db = require('./db.js');

exports.addExam = function(exam) {
    const addSlot = function(exam, slot){
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO Slot(ExamId, Start, End) VALUES(?, ? ,?) ";
            db.run(sql, [exam, slot.start, slot.end], function (err) {
                if(err){
                    console.log(err);
                    reject(err);
                }
                else{
                    resolve(this.lastID);
                }
            });
        });
    }
    const addStudent = function(exam, student){
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO ExamStudent(ExamId, StudentId) VALUES(?, ?) ";
            db.run(sql, [exam, student], function (err) {
                if(err){
                    console.log(err);
                    reject(err);
                }
                else{
                    resolve(this.lastID);
                }
            });
        });
    }
    
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Exam(CourseId) VALUES(?) ";
        db.run(sql, [exam.course], function (err) {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                const id = this.lastID;
                let promises = [];
                exam.students.forEach(student => promises.push(addStudent(id, student)));
                exam.slots.forEach(slot => promises.push(addSlot(id, slot)));
                Promise.all(promises).then(() => {
                    resolve(id);
                }).catch((err) => reject(err));
            }
        });
    });
}

const createExam = function(row){
    const id = row.ExamId;
    const courseName = row.CourseName;

    return {id: id, courseName: courseName};
}

//lista degli studenti che devono sostenere l'esame del corso
exports.getStudents = function(course) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT StudentId FROM CourseStudent WHERE CourseId = ? AND StudentId NOT IN ( " +
            "SELECT StudentId FROM Result R, Exam E WHERE E.ExamId = R.ExamId AND CourseId = ? AND Grade >= 18) ";
        db.all(sql, [course, course], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let students = rows.map((row) => row.StudentId);
                resolve(students);
            }
        });
    });
}

//lista degli esami dello studente
exports.getExamsByStudent = function(student) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT E.ExamId AS ExamId, C.Name AS CourseName FROM Exam E, Course C WHERE C.CourseId = E.CourseId AND ExamId IN (SELECT ExamId FROM ExamStudent WHERE StudentId = ?) ";
        db.all(sql, [student], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let exams = rows.map((row) => createExam(row));
                resolve(exams);
            }
        });
    });
}

//lista degli esami del corso per il docente
exports.getExamsByCourse = function(course) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT E.ExamId AS ExamId, C.Name AS CourseName FROM Exam E, Course C WHERE C.CourseId = E.CourseId AND E.CourseId = ? ";
        db.all(sql, [course], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let exams = rows.map((row) => createExam(row));
                resolve(exams);
            }
        });
    });
}

const createSlot = function(row){
    const id = row.SlotId;
    const start = row.Start;
    const end = row.End;

    return {id: id, start: start, end: end};
}

//lista degli slot disponibili alla prenotazione per lo studente
exports.getSlots = function(exam) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Slot WHERE ExamId = ? AND SlotId NOT IN (SELECT SlotId FROM Reservation) ";
        db.all(sql, [exam], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                console.log('exam '+exam+' ' +rows.length);
                let slots = rows.map((row) => createSlot(row));
                console.log(slots);
                resolve(slots);
            }
        });
    });
}

const createReservation = function(row) {
    const student = row.StudentId;
    const start = row.Start;
    const end = row.End;

    const slot = start ? {start: start, end: end} : null;

    return {student: student, slot: slot};
}

//lista degli studenti prenotati a un esame


exports.getStudentExam = function(id, student) {
    return new Promise((resolve, reject) => {
        let exam = {};
        Promise.all([exports.getReservation(id, student), exports.getResult(id, student)])
        .then(([reservation, result]) => {
            exam.reservation = reservation;
            exam.result = result;
            resolve(exam);
        }).catch((err) => reject(err));
    });
}

exports.getExam = function(id) {
    const getReservations = (exam) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT ES.StudentId AS StudentId, Start, End FROM ExamStudent ES LEFT OUTER JOIN (Reservation R JOIN Slot S ON S.SlotId = R.SlotId) ON (ES.StudentId = R.StudentId AND ES.ExamId = S.ExamId) WHERE ES.ExamId = ? AND ES.StudentId NOT IN (SELECT StudentId FROM Result WHERE ExamId = ?) "
            db.all(sql, [exam, exam], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let reservations = rows.map((row) => createReservation(row));
                    resolve(reservations);
                }
            });
        });
    }

    const getResults = (exam) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Result WHERE ExamId = ? ";
            db.all(sql, [exam], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let results = rows.map((row) => createResult(row));
                    resolve(results);
                }
            });
        });
    }

    return new Promise((resolve, reject) => {
        let exam = {};
        Promise.all([getReservations(id), getResults(id)])
        .then(([reservations, results]) => {
            exam.reservations = reservations;
            exam.results = results;
            resolve(exam);
        }).catch((err) => reject(err));
    });
}

//prenotazione dello studente all'esame
exports.getReservation = function(exam, student) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Reservation R, Slot S WHERE S.SlotId = R.SlotId AND ExamId = ? AND StudentId = ? ";
        db.all(sql, [exam, student], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                let reservation = createReservation(rows[0]);
                resolve(reservation);
            }
        });
    });
}

//aggiunge prenotazione dello studente allo slot
exports.addReservation = function(reservation) { 
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Reservation(SlotId, StudentId) VALUES(?, ?) ";
        db.run(sql, [reservation.slot, reservation.student], function (err) {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                console.log(this.lastID);
                resolve(this.lastID);
            }
        });
    });
}

const createResult = function(row){
    const student = row.StudentId;
    const absent = row.Absent;
    const grade = row.Grade;

    return {student: student, absent: absent, grade: grade};
}

//risultato dell'esame per lo studente
exports.getResult = function(exam, student) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Result WHERE ExamId = ? AND StudentId = ? ";
        db.all(sql, [exam, student], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const result = createResult(rows[0]);
                resolve(result);
            }
        });
    });
}

exports.addResult = function(result) { 
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Result(ExamId, StudentId, Absent, Grade) VALUES(?, ?, ?, ?) ";
        db.run(sql, [result.exam, result.student, result.absent, result.grade], function (err) {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                console.log(this.lastID);
                resolve(this.lastID);
            }
        });
    });
}