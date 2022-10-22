![Logo Groupomania](./frontend/groupomania/src/assets/images/icon-left-font-monochrome-white.svg)

_Groupomania est la premiere version d'un réseaux social d'entreprise_

# Technologie utilisé

- <img src="https://img.icons8.com/fluency/344/node-js.png" alt="logo nodejs" width="35px" height="35px"> Node.js

- <img src="https://img.icons8.com/color/344/server.png" alt="Logo server" width="35px" height="35px"> Express.js

- <img src="https://img.icons8.com/color/344/mongodb.png" alt="Logo MongoDb" width="35px" height="35px"> Mongo DB

- <img src="https://img.icons8.com/color/344/typescript.png" alt="Logo Typescript" width="35px" height="35px"> Typescript

- <img src="https://img.icons8.com/color/344/javascript--v1.png" alt="Logo Javascript" width="35px" height="35px"> Javascript

- <img src="https://img.icons8.com/color/344/angularjs.png" alt="logo Angular" width="35px" height="35px"> Angular

---

# BackEnd

- Dependance utilisé
  - Express
  - mongoose
  - mongoose-unique-validator
  - bcrypt
  - dotenv
  - express-mongo-sanitize
  - multer
  - password-validator
  - helmet
  - jsonwebtoken
  - nodemon server

## Cloner/télécharger le repository:

Télécharger le fichier zip ou dans la console
`git clone https://github.com/Dimorg95/Groupomania.git`

## Création de fichier/dossier a la racine du dossier backend

- Crée un dossier images
- Crée un fichier .env et rajouter les variables suivantes:
  - DATA_BASE_URL= (Qui contient le lien de la base de donnée)
  - isAdmin= (Contient l'adresse mail de l'utilisateur Admin)
  - ACCES_SECRET_TOKEN= (contient la clée de cryptage du token)

## Lancement du serveur (Via console)

> `cd backend`(Dirige la console dans le dossier backend)
> `npm install`(Installation de toute les dependance + node_modules)
> `npm install nodemon`(Installation de nodemon server _non obligatoire_)
> `nodemon server`(Lancement du serveur si nodemon est installer)
> **OU** `node server`(Lancement du serveur si nodemon n'est pas installer)
