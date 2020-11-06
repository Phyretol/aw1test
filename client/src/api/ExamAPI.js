const baseURL = "/api";

async function getExamsByStudent(student) {
    let url = "/students/" + student + '/exams';

    const response = await fetch(baseURL + url);
    const exams = await response.json();
    if(response.ok){
        return exams;
    } else {
        let err = {status: response.status, errObj:exams};
        throw err;  // An object with the error coming from the server
    }
}

async function getExamsByCourse(course) {
    let url = "/courses/" + course + '/exams';

    const response = await fetch(baseURL + url);
    const exams = await response.json();
    if(response.ok){
        return exams;
    } else {
        let err = {status: response.status, errObj:exams};
        throw err;  // An object with the error coming from the server
    }
}

async function getStudents(course) {
    let url = "/courses/" + course + '/students';

    const response = await fetch(baseURL + url);
    const students = await response.json();
    if(response.ok){
        return students;
    } else {
        let err = {status: response.status, errObj:students};
        throw err;  // An object with the error coming from the server
    }
}

async function getExam(id) {
    let url = "/exams/" + id;

    const response = await fetch(baseURL + url);
    const exam = await response.json();
    if(response.ok){
        return exam;
    } else {
        let err = {status: response.status, errObj:exam};
        throw err;  // An object with the error coming from the server
    }
}

async function getStudentExam(id, student) {
    let url = "/students/" + student + "/exams/" + id;

    const response = await fetch(baseURL + url);
    const exam = await response.json();
    if(response.ok){
        return exam;
    } else {
        let err = {status: response.status, errObj:exam};
        throw err;  // An object with the error coming from the server
    }
}

async function getSlots(exam) {
    let url = "/exams/" + exam + "/slots";

    const response = await fetch(baseURL + url);
    const slots = await response.json();
    if(response.ok){
        return slots;
    } else {
        let err = {status: response.status, errObj:slots};
        throw err;  // An object with the error coming from the server
    }
}

async function addExam(exam) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/exams", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exam)
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

async function addResult(result) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/results", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result)
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

async function addReservation(reservation) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/reservations", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservation)
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
    getExamsByStudent,
    getExamsByCourse,
    getStudentExam,
    getExam,
    getStudents,
    getSlots,
    addExam,
    addResult,
    addReservation
}
export default API;