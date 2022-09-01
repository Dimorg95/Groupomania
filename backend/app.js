const express = require('express');
const mongoose = require('mongoose');

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const path = require('path');

require('dotenv').config();

const app = express();

//Connection a la BDD
mongoose
  .connect(process.env.DATA_BASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à Mongodb réussie ! '))
  .catch(() => console.log('Connexion à MongoDB échouée ! '));

//Erreur CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);
module.exports = app;
