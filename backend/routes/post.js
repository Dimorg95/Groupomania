const express = require('express');
const multer = require('../middleware/multer-config');
const router = express.Router();

const postCtrl = require('../controllers/post');

router.post('/', multer, postCtrl.createPost);
router.get('/', postCtrl.getAllPost);
module.exports = router;
