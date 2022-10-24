const jwt = require('jsonwebtoken');
require('dotenv').config();

//Authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCES_SECRET_TOKEN);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    req.auth = {
      userId: userId,
      isAdmin: isAdmin,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
