const Post = require('../models/Post');

//Création de poste
exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);

  delete postObject._id;

  const post = new Post({
    ...postObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    usersLiked: [],
    userName: req.auth.userName,
    date: new Date(Date.now),
  });

  post
    .save()
    .then(() => res.status(201).json({ message: 'Post crée avec succé' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllPost = (req, res, next) => {
  Post.find()
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};
