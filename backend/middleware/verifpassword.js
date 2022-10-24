const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(6) //Minimum de 6 caractère
  .is()
  .max(100) //Maximum de 100 caractère
  .has()
  .uppercase() //Doit avoir des majuscule
  .has()
  .lowercase() //Doit avoir des miniscule
  .has()
  .digits(2) //Minimum de 2 chiffres
  .has()
  .not()
  .spaces(); //Aucun espace

module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      error: `Le mot de passe n'est pas assez fort ${passwordSchema.validate(
        'req.body.password',
        { list: true }
      )}`,
    });
  }
};

//Vérification du champs Password et de ca force
