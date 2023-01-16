![Logo Groupomania](./frontend/groupomania/src/assets/images/icon-left-font-monochrome-white.svg)

_Groupomania est la premiere version d'un réseaux social d'entreprise_

# Technologie utilisé

- <img src="https://img.icons8.com/fluency/344/node-js.png" alt="logo nodejs" width="35px" height="35px"> Node.js

- <img src="https://img.icons8.com/color/344/server.png" alt="Logo server" width="35px" height="35px"> Express.js

- <img src="https://img.icons8.com/color/344/mongodb.png" alt="Logo MongoDb" width="35px" height="35px"> Mongo DB

- <img src="https://img.icons8.com/color/344/typescript.png" alt="Logo Typescript" width="35px" height="35px"> Typescript

- <img src="https://img.icons8.com/color/344/javascript--v1.png" alt="Logo Javascript" width="35px" height="35px"> Javascript

- <img src="https://img.icons8.com/color/344/angularjs.png" alt="logo Angular" width="35px" height="35px"> Angular

- <img src="https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_scss_icon_130177.png" alt="logo Scss" width="35px" height="35px"> Scss

---

## Dépendances utilisées

- BackEnd :
  - express
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
- FrontEnd
  - Material

---

---

# BackEnd

## Cloner/télécharger le repository:

Télécharger le fichier zip ou dans la console:

`git clone https://github.com/Dimorg95/Groupomania.git`

---

## Création de fichier/dossier a la racine du dossier backend

- Crée un dossier images
- Crée un fichier .env et rajouter les variables suivantes:
  - DATA_BASE_URL= (Qui contient le lien de la base de donnée)
  - isAdmin= (Contient l'adresse mail de l'utilisateur Admin)
  - ACCES_SECRET_TOKEN= (contient la clée de cryptage du token)

---

## Lancement du serveur (Via console)

`cd backend` (Dirige la console dans le dossier backend)

`npm install` (Installation de toute les dependance + node_modules)

`npm install nodemon` (Installation de nodemon server _non obligatoire_)

`nodemon server` (Lancement du serveur si nodemon est installer)

**OU**

`node server` (Lancement du serveur si nodemon n'est pas installer)

### Dans les deux cas le backend sera lancer sur : **http://localhost:3000/**

---

---

# FrontEnd

## Lancement du frontEnd (Via console)

`cd frontend/groupomania` (Dirige la console dans le dossier)

`npm install` (Installation de toutes les dépendances + node_modules)

`ng serve` (Lancement du frontend)

### Le frontend sera lancer a l'adresse : **http://localhost:4200/**

---

# Fonctionnalités disponibles

- Inscription via formulaire (Nom, Email, Mots de passe)
- Connexion via formulaire (Email, Mot de passe)
- Visualisation des postes de l'ensemble des utilisateurs (ordre: Antéchronologique)
- Création et partage de poste avec ou sans image
- Les postes sans image peuvent en rajouter une a la modification
- Les postes avec image ne peuvent pas simplement enlever l'image et garder leur poste une suppression est nécessaire
- Chaque utilisateur peut modifier ou supprimer leur poste respectif
- Chaque utilisateur peut liker les postes (ou retirer son like)

  **Un compte Administrateur est a disposition pour modifier/supprimer n'importe quel poste et en crée si nécessaire**

---

# Aspect techniques/sécurités

- Les sessions utilisateurs persistent pendant 24h, au terme l'utilisateur doit ce reconnecter
- Sécurité implantée sur les requêtes en cas de session expirée
- Mots de passe cryptés en base de données
- Multiples vérifications au niveau des formulaires (inscription/post)

---

# Identité graphique

- Police d'écriture Lato
- Palette de couleur
  - Primaire: #FD2D01
  - Secondaire: #FFD7D7
  - Tertiaire: #4E5166
