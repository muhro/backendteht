'use strict'
require('dotenv').config();

const express = require('express');
const database = require('./modules/database');
const resize = require('./modules/resize');
const exif = require('./modules/exif');

const multer = require('multer');
const upload = multer({dest: 'public/files/'});

const app = express();

app.use(express.static('public'));

const connection = database.connect();

// testataan toimiiko tietokanta
database.select(connection, (results) => {
  console.log(results);
});

const insertToDB = (data, res, next) => {
  database.insert(data, connection, () => {
    next();
  });
};

const selectAll = (req, next) => {
  database.select(connection, (results) => {
    req.custom = results;
    next();
  });
};

// tallenna tiedosto
app.post('/upload', upload.single('kuva'), (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  next();
});

// hae kuvasta koordinaatit
app.use('/upload', (req, res, next) => {
  exif.getCoordinates(req.file.path).then((coordinates)=>{
    req.coordinates = coordinates;
    next();
  }).catch((error)=>{
    console.log(error);
    req.coordinates ={};
    next();
  });
});

// tee thumbnail
app.use('/upload', (req, res, next) => {
  resize.resizeImage(req.file.path, 150, './public/thumbs/' +
      req.file.filename + '_thumb').then(() => {
    next();
  });
});

// tallenna tiedot tietokantaan
app.use('/upload', (req, res, next) => {
  const data = [
    req.body.fname,
    req.body.lname,
    req.file.filename,
    req.file.filename + '_thumb',
    req.file.mimetype,
    req.coordinates,
  ];
  insertToDB(data, res, next);
});

app.use('/upload', (req, res, next) => {
  selectAll(req, next);
});


app.use('/upload', (req, res) => {
  res.send(req.custom);
});


app.listen(8000);