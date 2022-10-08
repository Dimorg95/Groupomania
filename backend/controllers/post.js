const Post = require('../models/Post');
const fs = require('fs');

//Création de poste
exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);

  //let regex = new RegExp(/[a-zA-Z]+$/);
  //let regex = new RegExp(/[a-zA-Z\s0-9\,\-\.]/);
  let regex = new RegExp(/\S[\w\s]+$/gm);
  console.log(postObject.title);
  console.log(postObject.text);
  console.log(postObject);
  // if (regex.test(postObject.text) && regex.test(postObject.title)) {
  delete postObject._id;
  delete postObject.userId;

  const post = new Post({
    ...postObject,
    userId: req.auth.userId,

    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    usersLiked: [],

    createdDate: new Date(Date.now()),
  });
  console.log(req.auth.userId);
  post
    .save()
    .then(() => res.status(201).json({ message: 'Post crée avec succé' }))
    .catch((error) => res.status(400).json({ error }));
  // } else {
  //   res.status(403).json({ message: 'Verification des champs incorrect' });
  // }
};

exports.modifyPost = (req, res, next) => {
  //Rajouter une validation via la meme regex de création de post
  console.log('demarrage');
  //Si changement d'image
  if (req.file) {
    console.log('dans le If');
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        const filename = post.imageUrl.split('/images/')[1];
        const newImageUrl = `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`;
        fs.unlink(`images/${filename}`, () => {
          const postObject = JSON.parse(req.body.post);
          const newDescription = postObject.text;
          const newTitle = postObject.title;
          if (req.auth.userId === postObject.userId) {
            Post.updateOne(
              { _id: req.params.id },
              {
                text: newDescription,
                title: newTitle,
                imageUrl: newImageUrl,
                createdDate: new Date(Date.now()),
              }
            )
              .then(() =>
                res.status(200).json({ message: 'Image et poste mis a jour' })
              )
              .catch((error) => res.status(400).json({ error }));
          }
        });
      })
      .catch((error) => res.status(500).json(error));
    //Si aucun changement d'image juste du text
  } else {
    console.log('on tombe dans le ELSE');
    const postObject = req.body;
    const newDescription = postObject.text;
    const newTitle = postObject.title;
    if (req.auth.userId === postObject.userId) {
      Post.updateOne(
        { _id: req.params.id },
        {
          text: newDescription,
          title: newTitle,
          createdDate: new Date(Date.now()),
        }
      )
        .then(() => res.status(200).json({ message: 'Texte mis a jour' }))
        .catch((error) => res.status(400).json({ error }));
    }
  }
};

// exports.modifyPost = (req, res, next) => {
//   console.log('alllloooo');
//   const postObject = req.file
//     ? {
//         ...JSON.parse(req.body.post),
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${
//           req.file.filename
//         }`,
//       }
//     : { ...req.body };
//   delete postObject._id;

//   Post.findOne({ _id: req.params.id })
//     .then((post) => {
//       if (post.userId != req.auth.userId) {
//         res.status(401).json({ message: 'Non Autorisé' });
//       } else {
//         Post.updateOne(
//           { _id: req.params.id },
//           { ...postObject, _id: req.params.id }
//         )
//           .then(() => res.status(200).json({ message: 'Objet modifier' }))
//           .catch((error) => res.status(401).json({ error }));
//       }
//     })
//     .catch((error) => {
//       res.status(400).json({ error });
//     });
// };

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

//Modification de post
exports.modifyPost = (req, res, next) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}:://${req.get('host')}/images${
          req.file.filename
        }`,
      }
    : { ...req.body };
};

//Suppression d'un post + son image
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (post.userId != req.auth.userId) {
      res.status(401).json({ message: 'Utilisateur non autorisé' });
    } else {
      const filename = post.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Post.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: 'Objet supprimé' });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      });
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
