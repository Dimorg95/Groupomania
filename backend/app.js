const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
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

//Gere le probléme de l'image illisible avec Helmet

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.crossOriginResourcePolicy({ policy: 'same-site' }));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

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

//Nettoye les données recues (enlevement de clée commencant par $)
//pour eviter l'injection
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: '_',
  })
);

app.use(express.json());
//Gestion static des images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);
module.exports = app;
