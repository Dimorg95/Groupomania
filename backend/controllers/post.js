const Post = require('../models/Post');
const fs = require('fs');

//Création de poste Version image obligatoire V1
// exports.createPost = (req, res, next) => {
//   const postObject = JSON.parse(req.body.post);
//   let regex = new RegExp(/^\S[A-Za-z0-9 -]*$/);
//   if (regex.test(postObject.text) && regex.test(postObject.title)) {
//     delete postObject._id;
//     delete postObject.userId;

//     const post = new Post({
//       ...postObject,
//       userId: req.auth.userId,

//       imageUrl: `${req.protocol}://${req.get('host')}/images/${
//         req.file.filename
//       }`,
//       usersLiked: [],

//       createdDate: new Date(Date.now()),
//     });
//     console.log(req.auth.userId);
//     post
//       .save()
//       .then(() => res.status(201).json({ message: 'Post crée avec succé' }))
//       .catch((error) => res.status(400).json({ error }));
//   } else {
//     res.status(403).json({ message: 'Verification des champs incorrect' });
//   }
// };

//Creation de poste avec ou sans image FONCTIONNEL OMG
//Probleme a la suppression de post vue que nous n'avons pas
//d'imageUrl enregistrer(dans le cas ou on a pas de photo a supprimer) RESOLU
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
//Modification de post ne modifie pas les post sans image a revoir V1
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
//       if (post.userId != req.auth.userId && req.auth.isAdmin === false) {
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

//Modification de post v1 deuxieme version
//Cette methode ne fonctionne pas bien nous pouvons modifier les post avec image
//en modifiant ou pas l'image
//Mais les postes sans image aucun code erreur mais la modification ne prend pas,
//sauf si nous ajoutons une image au post
//Je suppose que le probleme vien du front front nous envoyons une image null
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

// Modification de post V2 test MODIFIE LES POST SANS IMAGE et MODIFIE L'AJOUT/CHANGEMENT D'IMAGE
//Si l'image n'est pas remplacer code erreur 500 dans le cas ou une image est deja presente
// exports.modifyPost = (req, res, next) => {
//   const postObject = JSON.parse(req.body.post);
//   console.log(postObject);
//   delete postObject.userId;

//   Post.findOne({ _id: req.params.id }).then((post) => {
//     if (post.userId != req.auth.userId && req.auth.isAdmin === false) {
//       res.status(401).json({ message: 'Non Autorisé' });
//     } else {
//       if (req.file) {
//         console.log('ON ENTRE DANS LE IF SI IMAGE');
//         postObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${
//           req.file.filename
//         }`;
//       }
//       Post.updateOne(
//         { _id: req.params.id },
//         { ...postObject, _id: req.params.id }
//       )
//         .then(() => res.status(200).json({ message: 'Objet modifier' }))
//         .catch((error) => res.status(401).json({ error }));
//     }
//   });
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

//Suppression d'un post + son image V1
// exports.deletePost = (req, res, next) => {
//   Post.findOne({ _id: req.params.id }).then((post) => {
//     if (post.userId != req.auth.userId && req.auth.isAdmin === false) {
//       res.status(401).json({ message: 'Utilisateur non autorisé' });
//     } else {
//       const filename = post.imageUrl.split('/images/')[1];
//       fs.unlink(`images/${filename}`, () => {
//         Post.deleteOne({ _id: req.params.id })
//           .then(() => {
//             res.status(200).json({ message: 'Objet supprimé' });
//           })
//           .catch((error) => {
//             res.status(500).json({ error });
//           });
//       });
//     }
//   });
// };

//Suppression d'un post avec ou sans image test !! V2
//Si image url est present le supprimer + post sinon supprimer juste le post
//FONCTIONNE
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
