const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

//test enregistrement utilisateur

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

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
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
            userName: user.name,
            userEmail: req.body.email,
            userId: user._id,
            isAdmin: user.isAdmin,
            token: jwt.sign(
              { userId: user.id },
              process.env.ACCES_SECRET_TOKEN,
              { expiresIn: '24h' }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
