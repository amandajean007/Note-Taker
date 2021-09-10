const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public/'));








// The home page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// The notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
  res.status(200).json(notes)
});








// POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    console.log(title, text);
  
    // If all the required properties are present
    if (title && text ) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      };

   // Obtain existing notes
   fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);

      // Add a new note
      parsedNotes.push(newNote);

      // Write updated notes back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 3),
        (err) =>
          err
            ? console.error(err)
            : console.info('Successfully added note!')
      );
    }
  });


      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
     res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });
  

  // Delete an note
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  if (notes.id !== 0) {
    console.log(id);
    notes.splice(id, 1);
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(notes, null, 3),
            (err) =>
              err
                ? console.error(err)
                : console.info('Successfully deleted note!')
          );
    res.status(204).send();
  } else {
    res.status(405).send();
  }



//   app.delete('/notes/:id', (req, res) => {
//     notes
//         .removeNote(req.params.id)
//         .then(() => res.json({ ok: true }))
//         .catch(err => res.status(500).json(err))
// })

  
 });



  app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
  );
  