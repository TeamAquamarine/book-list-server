'use strict';
const express = require('express');
const pg = require('pg');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

//connections
const connectionString = process.env.DATABASE_URL;
// const connectionString = 'postgres://ccross:12345@localhost:5432/books_app';
const client = new pg.Client(connectionString);
client.connect();
client.on('error', err => console.log(err));

//middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/api/v1/books', (req, res) => {
  let SQL = `SELECT book_id, title, author, img_url FROM books;`

  client.query(SQL)
  .then(results => res.send(results.rows))
  .catch(console.error);
});

app.get('/api/v1/books/:id', (req, res) => {
  let SQL = `SELECT * FROM books WHERE book_id = $1;`
  let values = [req.params.id];

  client.query(SQL, values)
  .then(results => res.send(results.rows))
  .catch(console.error);
})

app.post('/api/v1/books/add', (req, res) => {
  let SQL = `INSERT INTO books(title, author, isbn, img_url, description) values($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING;`;

  let values = [
    req.body.title,
    req.body.author,
    req.body.isbn,
    req.body.img_url,
    req.body.description
  ]

  client.query(SQL, values)
  .then(results => res.status(200).send(results))
  .catch(console.error);
});

app.delete('/api/v1/books/delete/:id', (req, res) => {
  let SQL = `DELETE FROM books WHERE book_id = $1;`;
  let values = [req.params.id];

  client.query(SQL, values)
  .then(results => res.status(200).send(results))
  .catch(console.error);
})

app.put('/api/v1/books/update/:id', (req, res) => {
  let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, img_url=$4, description=$5 WHERE book_id=$6;`;
  let values = [req.body.title, req.body.author, req.body.isbn, req.body.img_url, req.body.description, req.params.id];
  
  client.query(SQL, values)
  .then(results => res.status(200).send(results))
  .catch(console.error);

})

app.get('*', (req, res) => {
  res.status(404);
  res.send('404: File not found')
})

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
