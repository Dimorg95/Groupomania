const express = require('express');
const multer = require('../middleware/multer-config');
const router = express.Router();
const auth = require('../middleware/auth');
const postCtrl = require('../controllers/post');

//Routes concernant les Postes
router.get('/', auth, postCtrl.getAllPost);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.post('/:id/like', auth, postCtrl.likePost);

module.exports = router;
