'use strict';

//import express
const express = require('express');
const examDao = require('./exam_dao');
const userDao = require('./teacher_dao');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 300; //seconds
// Authorization error
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };

//create application
const app = express();
const port = 3001;

let x = 0;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// Authentication endpoint
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userDao.getTeacher(username)
    .then((teacher) => {
        if(teacher === undefined) {
            res.status(404).send({
                errors: [{ 'param': 'Server', 'msg': 'Invalid username' }] 
              });
        } else {
            if(!userDao.checkPassword(teacher, password)){
                res.status(401).send({
                    errors: [{ 'param': 'Server', 'msg': 'Wrong password' }] 
                  });
            } else {
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ teacher: teacher.id }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json(teacher);
            }
        } 
    }).catch(
        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
    );
});

app.get('/api/courses/:course/students', (req,res) => {
    examDao.getStudents(req.params.course)
    .then((students) => res.json(students))
    .catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    })
});

app.get('/api/courses/:course/exams', (req,res) => {
    examDao.getExamsByCourse(req.params.course)
    .then((exams) => res.json(exams))
    .catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    })
});

app.get('/api/students/:student/exams', (req,res) => {
    x = x+1;
    console.log(x);
    console.log("Hello");
    examDao.getExamsByStudent(req.params.student)
    .then((exams) => res.json(exams))
    .catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    })
});

app.get('/api/students/:student/exams/:exam', (req,res) => {
    examDao.getStudentExam(req.params.exam, req.params.student)
    .then((exam) => res.json(exam))
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    })
});

app.get('/api/exams/:exam/slots', (req,res) => {
    examDao.getSlots(req.params.exam)
    .then((slots) =>{ res.json(slots); console.log(slots);})
    .catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    })
});

app.get('/api/exams/:exam', (req,res) => {
    examDao.getExam(req.params.exam)
    .then((exam) => res.json(exam))
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    })
});

app.post('/api/reservations', (req,res) => {
    const reservation = req.body;
    if(!reservation){
        res.status(400).end();
    } else {
        examDao.addReservation(reservation)
        .then((id) => res.status(201).json({"id" : id}))
        .catch((err) => {
            res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
        });
    }
});

app.get('/api/students/:student/exams/:exam', (req,res) => {
    examDao.getStudentExam(req.params.exam, req.params.student)
    .then((exam) => res.json(exam))
    .catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    })
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token,
        algorithms: ['HS256']
    })
);
  
// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(authErrorObj);
    }
});

// AUTHENTICATED REST API endpoints

//GET /user
app.get('/api/teacher', (req,res) => {
    const teacher = req.user && req.user.teacher;
    userDao.getTeacherById(teacher)
    .then((teacher) => {
        res.json(teacher);
    }).catch(
        (err) => {
            res.status(401).json(authErrorObj);
        }
    );
});

app.post('/api/results', (req,res) => {
    const result = req.body;
    if(!result){
        res.status(400).end();
        console.log(result);
    } else {
        examDao.addResult(result)
        .then((id) => res.status(201).json({"id" : id}))
        .catch((err) => {
            res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
        });
    }
});

app.post('/api/exams', (req,res) => {
    const exam = req.body;
    if(!exam){
        res.status(400).end();
    } else {
        examDao.addExam(exam)
        .then((id) => res.status(201).json({"id" : id}))
        .catch((err) => {
            res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
        });
    }
});

//activate server
app.listen(port, () => console.log('Server ready'));