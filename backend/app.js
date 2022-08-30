const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

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

app.use('/api/auth', userRoutes);

module.exports = app;
