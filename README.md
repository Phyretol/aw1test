# Exam #3: "Scheduling"
## Student: s280092 RIVOIRA FEDERICO 

## React client application routes

- Route `/home`: pagina iniziale, input matricola studente
- Route `/exams`: lista esami disponibili per studenti o docenti con collegamenti
- Route `/exams/:id`: riepilogo esame con possibili azioni (diversificato per studenti e docenti)
- Route `/create`: creazione esami per docenti
- Route `/slots/:exam`: prenotazione slot di un esame per studenti
- Route `/login`: accesso studenti

## REST API server

- POST `/login`
  - request parameters and request body content
  - response body content
- GET `api/courses/:course/students`
  - request parameters : id corso
  - response body content : array con matricole degli studenti che devono fare l'esame del corso
- GET `/api/courses/:course/exams`
  - request parameters : id corso
  - response body content : array con esami del corso
- GET `/api/students/:student/exams`
  - request parameters : matricola studente
  - response body content : array con esami dello studente
- GET `/api/students/:student/exams/:exam`
  - request parameters : matricola studente, id esame
  - response body content : oggetto esame con dati per lo studente (prenotazione, risultato)
- GET `/api/exams/:exam`
  - request parameters : id esame
  - response body content : oggetto esame con dati di tutti gli studenti (prenotazioni + non prenotati con slot=null, risultati)
- GET `/api/exams/:exam/slots`
  - request parameters : id esame
  - response body content : array con slot dell'esame disponibili per la prenotazione
- GET `/api/teacher`
  - request parameters : token jwt
  - response body content : recupera i dati del docente connesso
- POST `/api/reservations`
  - request parameters and request body content : oggetto prenotazione da aggiungere
  - response body content : 
- POST `/api/results`
  - request parameters and request body content : oggetto risultato da aggiungere
  - response body content : 
- POST `'/api/exams'`
  - request parameters and request body content : oggetto esame da aggiungere
  - response body content : 

## Server database

- Table `Teacher` - contiene dati di autenticazione per i docenti
- Table `Course` - contiene elenco dei corsi
- Table `CourseStudent` - contiene elenco di studenti per ogni corso
- Table `Exam` - contiene elenco di esami
- Table `ExamStudent` - contiene elenco di studenti per ogni esame
- Table `Slot` - contiene slot di esami
- Table `Reservation` - contiene prenotazioni di studenti a slot di esami
- Table `Result` - contiene risultati di esami

## Main React Components

- `ExamComponentStudent` : dettaglio esame per studente con varie azioni (prenotazione, consultazione slot prenotato o risultati)
- `ExamComponentTeacher` : dettaglio esame per docente con varie azioni (elenco prenotati, valutazione studenti e consultazione risultati)
- `ExamForm` : form per la definizione di un nuovo esame per docenti
- `ExamList` : elenco esami
- `SlotList` : selezione slot da prenotare per studenti
- `StudentForm` : componente per l'inserimento della matricola studente

(only _main_ components, minor ones may be skipped)

## Screenshot

![Configurator Screenshot 1](./img/screenshot1.jpg)
![Configurator Screenshot 2](./img/screenshot2.jpg)

## Test users

## username, password
* masalaenrico, elefante
* rossimario, giraffa

## studenti
* matricole : 1001-1015
