'use strict';
const express = require('express');
const pg = require('pg');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = `postgres://sharon:@localhost:5432/books_app`;
const client = new pg.Client(connectionString);
client.connect();
client.on('error', err => console.log(err));

app.get('/api/v1/books', (req, res) => {
  let SQL = `SELECT book_id, title, author, img_url FROM books;`

  client.query(SQL)
  .then(results => res.send(results.rows))
  .catch(console.error);
});

app.get('/api/v1/books/:id', (req, res) => {
  let SQL = `SELECT * FROM books WHERE book_id = $1`
  let values = [req.params.id];

  client.query(SQL, values)
  .then(results => res.send(results.rows))
  .catch(console.error);
})

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
