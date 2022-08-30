module.exports = (req, res, next) => {
  const validEmail = (email) => {
    let regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,10}/;
    let regexTrue = regex.test(email);
    regexTrue ? next() : res.status(400).json({ message: 'Mail invalide' });
  };
  validEmail(req.body.email);
};
