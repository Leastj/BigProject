import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRoutes from './routes/users.js';
import eventsRoutes from './routes/events.js';
import matchesRoutes from './routes/matches.js';
import roundsRoutes from './routes/rounds.js';
import authRoutes from './routes/auth.js';

import User from './models/user.js';



// Connexion au serveur 
const app = express(); // Création d'une instance de l'application Express
const hostname = 'localhost';
const port = 3000;
app.use(express.json());
app.use(cookieParser())

main().catch(err => console.log(err));


// code de connexion à Mongoose 
// remplacer mongodb://127.0.0.1:27017/bigProjectBD par l'URL de connexion.
async function main() {
  await mongoose.connect('mongodb://127.0.0.1/bigProjectBD', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connexion à la base de données réussie'); // Affichage d'un message dans la console si la connexion à la base de données est réussie
  // let userTest = new User( { pseudo: "toto", mail:"test", password: "tutu"} )
  // userTest.save()
  /*  let test = await User.find({ _id: "64411314bc490ebff8610696"});
   console.log(test)
 } */

}

app.listen(port, hostname, () => {
  console.log(`Serveur démarré sur http://${hostname}:${port}`); // Affichage d'un message dans la console lorsque le serveur Express démarre
});

app.use(express.static('public'))

app.use("/api", async (req, res, next) => {
  res.set({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": req.headers.origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
    "Access-Control-Allow-Headers": "Content-Type, *"
  })
  if (req.path.startsWith('/auth/')) {
    next()
    return
  }
  const token = req.cookies.Authentification;
  if (token) {
    req.user = await User.findOne({ token });
    if (req.user) {
      next();
    }
  } else {
    res.status(400).json({message: "Vous n'êtes pas autorisé"})
  }
});

app.use("/api/users", usersRoutes)
app.use("/api/events", eventsRoutes)
app.use("/api/matches", matchesRoutes)
app.use("/api/round", roundsRoutes)
app.use("/api/auth", authRoutes)

