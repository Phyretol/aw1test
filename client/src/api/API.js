
const baseURL = "/api";

// AGGIUNGERE FUNZIONI IN EXPORT
// AGGIUNGERE FUNZIONI IN EXPORT
// AGGIUNGERE FUNZIONI IN EXPORT
// AGGIUNGERE FUNZIONI IN EXPORT


async function isAuthenticated(){
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}

async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

async function getBoards() {
    let url = "/boards";

    const response = await fetch(baseURL + url);
    const boards = await response.json();
    if(response.ok){
        return boards;
    } else {
        let err = {status: response.status, errObj:boards};
        throw err;  // An object with the error coming from the server
    }
}

async function getMySharedBoards() {
    let url = "/boards/sharedByMe";

    const response = await fetch(baseURL + url);
    const boards = await response.json();
    if(response.ok){
        return boards;
    } else {
        let err = {status: response.status, errObj:boards};
        throw err;  // An object with the error coming from the server
    }
}


async function getOtherSharedBoards() {
    let url = "/boards/sharedToMe";

    const response = await fetch(baseURL + url);
    const boards = await response.json();
    if(response.ok){
        return boards;
    } else {
        let err = {status: response.status, errObj:boards};
        throw err;  // An object with the error coming from the server
    }
}

async function createBoard(name) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/boards", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name : name}),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteBoard(boardId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/boards/" + boardId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function getCards(columnId) {
    let url = "/cards/" + columnId;

    const response = await fetch(baseURL + url);
    const cards = await response.json();
    if(response.ok){
        return cards;
    } else {
        let err = {status: response.status, errObj:cards};
        throw err;  // An object with the error coming from the server
    }
}

async function createCard(columnId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/cards", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({columnId : columnId}),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function updateCard(card) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/cards/" + card.cardId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(card)
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteCard(cardId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/cards/" + cardId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function getColumns(boardId) {
    let url = "/columns/" + boardId;

    const response = await fetch(baseURL + url);
    const columns = await response.json();
    if(response.ok){
        return columns;
    } else {
        let err = {status: response.status, errObj:columns};
        throw err;  // An object with the error coming from the server
    }
}

async function createColumn(boardId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/columns", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({boardId : boardId}),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function updateColumn(column) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/columns/" + column.columnId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(column)
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteColumn(columnId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/columns/" + columnId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function getLinks(cardId) {
    let url = "/links/" + cardId;

    const response = await fetch(baseURL + url);
    const links = await response.json();
    if(response.ok){
        return links;
    } else {
        let err = {status: response.status, errObj:links};
        throw err;  // An object with the error coming from the server
    }
}

async function createLink(link) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/links", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(link)
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function updateLink(link) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/links/" + link.linkId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(link)
        }).then( (response) => {
            if(response.ok) {

            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteLink(linkId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/links/" + linkId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

const API = { 
    isAuthenticated,
    userLogin,
    userLogout,
    getBoards,
    createBoard,
    deleteBoard,
    getColumns,
    createColumn,
    updateColumn,
    deleteColumn,
    getCards,
    createCard,
    updateCard,
    deleteCard,
    getLinks,
    createLink,
    updateLink,
    deleteLink,
    getMySharedBoards,
    getOtherSharedBoards
}

export default API;