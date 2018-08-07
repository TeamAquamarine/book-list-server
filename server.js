'use strict';
const express = require('express');
const pg = require('pg');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = `postgres://sharon:@localhost:5432/books_app`;
const client = new pg.Client(connectionString);
client.connect();

app.get('/test', (req, res ) => res.send('hello world!!!') )
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
