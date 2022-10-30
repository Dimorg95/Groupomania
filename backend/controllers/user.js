const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

//Inscription

exports.signup = (req, res, next) => {
  //Chiffrage du mdp
  console.log(req.body.email);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        isAdmin: req.body.email === process.env.isAdmin ? true : false,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Connexion
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log(req.body.email);
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé',
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: 'Paire Email/Mot de passe incorrect',
            });
          }
          res.status(200).json({
            userId: user._id,
            isAdmin: user.isAdmin,
            token: jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin },
              process.env.ACCES_SECRET_TOKEN,

              { expiresIn: '24h' }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Récupérer un utilisateur

exports.getOneUser = (req, res, next) => {
  console.log(req.params.id);
  User.findOne({ _id: req.params.id })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(400).json({ error }));
};
