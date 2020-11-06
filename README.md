# Exam #12345: "Exam Title"
## Student: s123456 LASTNAME FIRSTNAME 

## React client application routes

- Route `/home`: page content and purpose
- Route `/shared`: page content and purpose
- Route `/login`: page content and purpose
- Route `/boards/:boardId`: page content and purpose, param specification

## REST API server

- POST `/login`
  - request parameters and request body content
  - response body content
- GET `/api/boards/`
  - 
  - elenco kaban board di un utente collegato nel formato : 
        boardId : identificativo della board
        name : nome della board
        cardCount : numero di schede della board
        expiredCardCount : numero di schede scadute
- POST `/api/boards/`
  - name : nome della board da creare
  - 
- DELETE `/api/boards/<boardId>`
  - boardId : identificativo della board da eliminare
  - 
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Server database

- Table `User` - contiene dati degli utenti registrati
- Table `Board` - contiene elenco delle kanban board con nomi e proprietari
- Table `Column` - contiene colonne delle board con titoli e posizione
- Table `Card` - contiene schede delle board con posizione (relativa alla colonna)
- Table `User_Board` - contiene utenti con cui le board sono condivise
- Table `Link` - contiene link delle board con url

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Configurator Screenshot](./img/screenshot.jpg)

## Test users

* mario.rossi12@gmail.com       baobab
* giulio.verdi22@gmail.com      aloha
* anna.bianchi13@libero.it      foxtrot
* marco.neri33@yahoo.com        tango
* sara.gialli65@outlook.com     delta
