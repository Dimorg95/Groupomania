const Post = require('../models/Post');
const fs = require('fs');

//Creation de poste avec ou sans image FONCTIONNEL OMG

exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  delete postObject.userId;
  const post = new Post({
    ...postObject,
    userId: req.auth.userId,
    usersLiked: [],
    createdDate: new Date(Date.now()),
  });
  if (req.file) {
    post.imageUrl = `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`;
  }

  console.log(post);
  post
    .save()
    .then(() => res.status(201).json({ message: 'Post crée' }))
    .catch((error) => res.status(400).json({ error }));
};

//Modification de post v1 deuxieme version

exports.modifyPost = (req, res, next) => {
  console.log('alllloooo');

  const postObject = req.file
    ? {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  console.log(postObject);
  delete postObject._id;

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.userId != req.auth.userId && req.auth.isAdmin === false) {
        res.status(401).json({ message: 'Non Autorisé' });
      } else {
        Post.updateOne(
          { _id: req.params.id },
          { ...postObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Objet modifier' }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Recuperation et envoie de tout les post en BDD
exports.getAllPost = (req, res, next) => {
  Post.find()
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

//Suppression d'un post avec ou sans image test !! V2

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (post.userId != req.auth.userId && req.auth.isAdmin === false) {
      res.status(401).json({ message: 'Utilisateur non autorisé' });
    } else {
      if (post.imageUrl) {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Objet supprimé + image' });
            })
            .catch((error) => {
              res.status(500).json({ error });
            });
        });
      } else {
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimer' }))
          .catch((error) => res.status(500).json({ error }));
      }
    }
  });
};

//Like/Unlike des posts
exports.likePost = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let postId = req.params.id;

  switch (like) {
    //Si le userId qui veux like n'est pas present dans le usersLiked
    //Alors on ajoute userId aux tableau et +1 au likes
    case 1:
      Post.findOne({ _id: postId })
        .then((post) => {
          if (post.usersLiked.includes(userId)) {
            res.status(401).json({ message: 'Vous avez deja aimer ce post' });
          } else {
            Post.updateOne(
              { _id: postId },
              { $push: { usersLiked: userId }, $inc: { likes: +1 } }
            )
              .then(() => res.status(200).json({ message: 'Like' }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    //Si le userId est present dans usersLiked alors on l'enleve et -1 aux likes
    //Sinon message
    case 0:
      Post.findOne({ _id: postId })
        .then((post) => {
          if (post.usersLiked.includes(userId)) {
            Post.updateOne(
              { _id: postId },
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: 'Unlike' }))
              .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(401).json({ message: "Vous n'avais pas like le post" });
          }
        })
        .catch((error) => res.status(400).json({ error }));
      break;

    default:
      console.log('erreur');
  }
};
