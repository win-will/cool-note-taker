const fs = require('fs');
const shortid = require('shortid');

const express = require('express');
const path = require('path');
const PORT = 3001;
const app = express();


// Parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/notes', notesRouter);

app.use(express.static('public'));

// GET index.html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET notes.index.html 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// View all notes 
app.get('/api/notes', (req, res) => {
  res.json(JSON.parse(fs.readFileSync('./db/db.json', "utf8")));
});

// View a note 
app.get('/notes/:id', (req, res) => {
  let id = req.params.id;
  let note = null;
  let notes = JSON.parse(fs.readFileSync('./db/db.json', "utf8"));

  for (n of notes){
    if (n.id === id) {
      note = n;
      break;
    }
  }

  if (note) res.json(note);
  else res.json("Error: Note id not found in db");

});

//Add Note
app.post('/api/notes', (req, res) => {

  // Destructuring assignment for the items in req.body
  const { text, title} = req.body;
  const id = shortid.generate();

  // If all the required properties are present
  if ( id && text && title) {
    // Variable for the object we will save
    const newNote = {
      id,
      title,
      text
    };
    
    let db = JSON.parse(fs.readFileSync('./db/db.json'));
    db.push(newNote);
    fs.writeFileSync('./db/db.json',JSON.stringify(db));

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } 
  else {
    res.json('Error in posting feedback');
  }

});

//Delete notes
app.delete('/api/notes/:id', (req, res) => {
  let id = req.params.id;
  let notes = JSON.parse(fs.readFileSync('./db/db.json', "utf8"));
  let newNotes = [];
  let deletedNote = null;

  for (n of notes){

    if (n.id != id) newNotes.push(n);
    else deletedNote = n;

  }


  if (deletedNote && newNotes) {
    fs.writeFileSync('./db/db.json',JSON.stringify(newNotes));
    res.json(deletedNote);
  }
  else {
    res.json("Error: Note with specified id not found in db, and it was not deleted");
  }

});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
