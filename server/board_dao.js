'use strict';

const db = require('./db.js');

exports.getBoards = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT B.BoardId, Name, ' +
        'COUNT(CardId) AS CardCount, ' +
        'COUNT(CASE WHEN ExpiryDate < DATE("now") THEN 1 END) AS ExpiredCardCount ' +
        'FROM Board B LEFT JOIN Column C ON B.BoardId = C.BoardId LEFT JOIN Card ON C.ColumnId=Card.ColumnId ' +
        'WHERE UserId = ? OR B.BoardId IN( ' +
            'SELECT BoardId FROM User_Board WHERE UserId = ? ' + 
        ') GROUP BY B.BoardId, Name';
        db.all(sql, [userId, userId], (err, rows) => {
            if (err) 
                reject(err);
            else{
                const boards = rows.map((row) => ({ 
                    boardId : row.BoardId, 
                    name : row.Name, 
                    cardCount : row.CardCount, 
                    expiredCardCount : row.ExpiredCardCount 
                }));
                console.log(boards);
                resolve(boards);
            }
        });
    });
};

exports.getBoardsSharedBy = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Board WHERE UserId = ? AND BoardId IN( " +
            "SELECT BoardId FROM User_Board)";
        db.all(sql, [userId], (err, rows) => {
            if (err) 
                reject(err);
            else{
                const boards = rows.map((row) => ({ 
                    boardId : row.BoardId, 
                    name : row.Name
                }));
                resolve(boards);
            }
        });
    });
};

exports.getBoardsSharedWith = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Board WHERE BoardId IN( " +
            "SELECT BoardId FROM User_Board WHERE UserId = ?) ";
        db.all(sql, [userId], (err, rows) => {
            if (err) 
                reject(err);
            else{
                const boards = rows.map((row) => ({ 
                    boardId : row.BoardId, 
                    name : row.Name
                }));
                resolve(boards);
            }
        });
    });
};

exports.getCards = function(columnId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Card WHERE ColumnId = ?";
        db.all(sql, [columnId], (err, rows) => {
            if (err) 
                reject(err);
            else{
                const cards = rows.map((row) => ({ 
                    cardId : row.CardId, 
                    columnId : row.ColumnId,
                    position : row.Position,
                    title : row.Title, 
                    description : row.Description, 
                    expiryDate : row.ExpiryDate
                }));
                resolve(cards);
            }
        });
    });
};

exports.createBoard = function(userId, name) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Board(UserId, Name) VALUES(?, ?)';
        db.run(sql, [userId, name], function (err) {
            if(err){
                console.log(err);
                reject(err);
            }
            else {
                const boardId = this.lastID;
                module.exports.createColumn(boardId).then(() => {
                    module.exports.createColumn(boardId).then(() => (resolve(boardId)));
                }).catch((err) => reject(err));
            }
        });
    });
};

exports.deleteBoard = function(boardId) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Board WHERE BoardId = ?';
        db.run(sql, [boardId], (err) => {
            if(err)
                reject(err);
        });

        const sql2 = 'DELETE FROM Column WHERE BoardId = ?';
        db.run(sql2, [boardId], (err) => {
            if(err)
                reject(err);
        });

        const sql3 = 'DELETE FROM Card, Column WHERE Column.ColumnId = Card.ColumnId AND BoardId = ?';
        db.run(sql3, [boardId], (err) => {
            if(err)
                reject(err);
            else 
                resolve(null);
        });
    });
}

exports.createCard = function(columnId) {
    return new Promise((resolve, reject) => {
        let position = 0;
        const sql = "SELECT MAX(Position) AS Max FROM Card WHERE ColumnId = ?"
        db.get(sql, [columnId], (err, row) => {
            if (err) 
                reject(err);
            if(row.Max)
                position = row.Max+1;
        });

        const sql2 = 'INSERT INTO Card(ColumnId, Position, Title, Description) VALUES(?, ?, ?, ?)';
        db.run(sql2, [columnId, position, "Nuova scheda", "Descrizione"], function (err) {
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

exports.updateCard = function(cardId, card) {
    /*if(newTask.deadline){
        newTask.deadline = moment(newTask.deadline).format("YYYY-MM-DD HH:mm");
    }*/
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Card SET ColumnId = ?, Position = ?, Title = ?, Description = ?, ExpiryDate = ? WHERE CardId = ?';
        db.run(sql, [card.columnId, card.position, card.title, card.description, card.expiryDate, cardId], (err) => {
            if(err){
                console.log(err);
                reject(err);
            }
            else
                resolve(null);
        })
    });
}

exports.deleteCard = function(cardId) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Card WHERE CardId = ?';
        db.run(sql, [cardId], (err) => {
            if(err)
                reject(err);
            else 
                resolve(null);
        })
    });
}

exports.getColumns = function(boardId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Column WHERE BoardId = ?"
        db.all(sql, [boardId], (err, rows) => {
            if (err) 
                reject(err);
            else{
                const columns = rows.map((row) => ({ columnId : row.ColumnId, title : row.Title, position : row.Position }));
                resolve(columns);
            }
        });
    });
};

exports.createColumn = function(boardId) {
    return new Promise((resolve, reject) => {
        let position = 0;
        const sql = "SELECT MAX(Position) AS Max FROM Column WHERE BoardId = ?"
        db.get(sql, [boardId], (err, row) => {
            if (err) 
                reject(err);
            if(row.Max)
                position = row.Max+1;
        });

        const sql2 = 'INSERT INTO Column(BoardId, Position, Title) VALUES(?, ?, ?)';
        db.run(sql2, [boardId, position, "Nuova Colonna"], function (err) {
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

exports.updateColumn = function(columnId, column) {
    /*if(newTask.deadline){
        newTask.deadline = moment(newTask.deadline).format("YYYY-MM-DD HH:mm");
    }*/
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Column SET Title = ?, Position = ? WHERE ColumnId = ?';
        db.run(sql, [column.title, column.position, columnId], (err) => {
            if(err){
                console.log(err);
                reject(err);
            }
            else
                resolve(null);
        })
    });
}

exports.deleteColumn = function(columnId) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Column WHERE ColumnId = ?';
        db.run(sql, [columnId], (err) => {
            if(err)
                reject(err);
        });

        const sql2 = 'DELETE FROM Card WHERE ColumnId = ?';
        db.run(sql2, [columnId], (err) => {
            if(err)
                reject(err);
            else 
                resolve(null);
        });
    });
}

exports.getLinks = function(cardId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Link WHERE cardId = ?"
        db.all(sql, [cardId], (err, rows) => {
            if (err) 
                reject(err);
            else{
                const links = rows.map((row) => ({ cardId : row.cardId, url : row.url }));
                resolve(links);
            }
        });
    });
};

exports.createLink = function(link) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Link(CardId, Url) VALUES(?, ?, ?)';
        db.run(sql, [link.cardId, link.url], function (err) {
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

exports.updateLink = function(linkId, link) {
    /*if(newTask.deadline){
        newTask.deadline = moment(newTask.deadline).format("YYYY-MM-DD HH:mm");
    }*/
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Link SET Url = ? WHERE LinkId = ?';
        db.run(sql, [link.url, linkId], (err) => {
            if(err){
                console.log(err);
                reject(err);
            }
            else
                resolve(null);
        })
    });
}

exports.deleteLink = function(linkId) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Link WHERE LinkId = ?';
        db.run(sql, [linkId], (err) => {
            if(err)
                reject(err);
            else 
                resolve(null);
        })
    });
}

exports.shareBoard = function(shareObj) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO User_Board(BoardId, UserId) VALUES(?, ?)';
        db.run(sql, [shareObj.boardId, shareObj.userId], function (err) {
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