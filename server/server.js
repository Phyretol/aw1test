'use strict';

//import express
const express = require('express');
const boardDao = require('./board_dao');
const userDao = require('./user_dao');
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

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());





//LOGIN

// Authentication endpoint
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userDao.getUser(username)
      .then((user) => {

        if(user === undefined) {
            res.status(404).send({
                errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }] 
              });
        } else {
            if(!userDao.checkPassword(user, password)){
                res.status(401).send({
                    errors: [{ 'param': 'Server', 'msg': 'Wrong password' }] 
                  });
            } else {
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({id: user.id, name: user.name});
            }
        } 
      }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
      );
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
app.get('/api/user', (req,res) => {
    const user = req.user && req.user.user;
    userDao.getUserById(user)
    .then((user) => {
        res.json({id: user.id, name: user.name});
    }).catch(
        (err) => {
            res.status(401).json(authErrorObj);
        }
    );
});





//BOARDS

//GET /boards
app.get('/api/boards', (req,res) => {
    const user = req.user && req.user.user;
    boardDao.getBoards(user)
    .then((boards) => {
        res.json(boards);
    }).catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    });
});

//GET /boards/sharedBy
app.get('/api/boards/sharedBy', (req,res) => {
    const user = req.user && req.user.user;
    boardDao.getBoardsSharedBy(user)
    .then((boards) => {
        res.json(boards);
    }).catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    });
});

//GET /boards/sharedWith
app.get('/api/boards/sharedWith', (req,res) => {
    const user = req.user && req.user.user;
    boardDao.getBoardsSharedWith(user)
    .then((boards) => {
        res.json(boards);
    }).catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    });
});

//POST /boards
app.post('/api/boards', (req,res) => {
    const board = req.body;
    if(!board){
        res.status(400).end();
    } else {
        const user = req.user && req.user.user;
        boardDao.createBoard(user, board.name)
        .then((id) => res.status(201).json({"id" : id}))
        .catch((err) => {
            res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
        });
    }
});

//DELETE /boards/<boardId>
app.delete('/api/boards/:boardId', (req,res) => {
    boardDao.deleteBoard(req.params.boardId)
    .then((result) => res.status(204).end())
    .catch((err) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}],
    }));
});





//COLUMNS

//GET /columns/<boardId>
app.get('/api/columns/:boardId', (req,res) => {
    const user = req.user && req.user.user;
    boardDao.getColumns(req.params.boardId)
    .then((columns) => {
        res.json(columns);
    }).catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    });
});

//POST /columns
app.post('/api/columns', (req,res) => {
    const column = req.body;
    if(!column){
        res.status(400).end();
    } else {
        const user = req.user && req.user.user;
        boardDao.createColumn(column.boardId)
        .then((id) => res.status(201).json({"id" : id}))
        .catch((err) => {
            res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
        });
    }
});

//PUT /columns/<columnId>
app.put('/api/columns/:columnId', (req,res) => {
    const column = req.body;
    const user = req.user && req.user.user;
    boardDao.updateColumn(req.params.columnId, column)
    .then((result) => res.status(200).end())
    .catch((err) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}],
    }));
});

//DELETE /columns/<columnId>
app.delete('/api/columns/:columnId', (req,res) => {
    boardDao.deleteColumn(req.params.columnId)
    .then((result) => res.status(204).end())
    .catch((err) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}],
    }));
});





//CARDS

//GET /cards/<columnId>
app.get('/api/cards/:columnId', (req,res) => {
    const user = req.user && req.user.user;
    boardDao.getCards(req.params.columnId)
    .then((cards) => {
        res.json(cards);
    }).catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    });
});

//POST /cards
app.post('/api/cards', (req,res) => {
    const card = req.body;
    if(!card){
        res.status(400).end();
    } else {
        const user = req.user && req.user.user;
        boardDao.createCard(card.columnId)
        .then((id) => res.status(201).json({"id" : id}))
        .catch((err) => {
            res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
        });
    }
});

//PUT /cards/<cardId>
app.put('/api/cards/:cardId', (req,res) => {
    const card = req.body;
    const user = req.user && req.user.user;
    boardDao.updateCard(req.params.cardId, card)
    .then((result) => res.status(200).end())
    .catch((err) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}],
    }));
});

//DELETE /cards/<cardId>
app.delete('/api/cards/:cardId', (req,res) => {
    boardDao.deleteCard(req.params.cardId)
    .then((result) => res.status(204).end())
    .catch((err) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}],
    }));
});


//CARDS

//GET /links/<cardId>
app.get('/api/links/:cardId', (req,res) => {
    const user = req.user && req.user.user;
    boardDao.getLinks(req.params.cardId)
    .then((links) => {
        res.json(links);
    }).catch((err) => {
        res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        })
    });
});

//POST /links
app.post('/api/links', (req,res) => {
    const link = req.body;
    if(!link){
        res.status(400).end();
    } else {
        const user = req.user && req.user.user;
        boardDao.createLink(link)
        .then((id) => res.status(201).json({"id" : id}))
        .catch((err) => {
            res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
        });
    }
});

//PUT /links/<linkId>
app.put('/api/links/:linkId', (req,res) => {
    const link = req.body;
    const user = req.user && req.user.user;
    boardDao.updateLink(req.params.linkId, link)
    .then((result) => res.status(200).end())
    .catch((err) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}],
    }));
});

//DELETE /links/<linkId>
app.delete('/api/links/:linkId', (req,res) => {
    boardDao.deletelink(req.params.linkId)
    .then((result) => res.status(204).end())
    .catch((err) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}],
    }));
});

//POST /share
app.post('/share', (req,res) => {
    const shareObj = req.body;
    if(!shareObj){
        res.status(400).end();
    } else {
        const user = req.user && req.user.user;
        boardDao.shareBoard(shareObj)
        .then((id) => res.status(201).json({"id" : id}))
        .catch((err) => {
            res.status(500).json({errors: [{'param': 'Server', 'msg': err}],})
        });
    }
});

//activate server
app.listen(port, () => console.log('Server ready'));