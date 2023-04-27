import express from 'express';
import mongoose from 'mongoose';
import usersRoutes from './routes/users.js';
// Connexion au serveur 
const app = express(); // Création d'une instance de l'application Express
const hostname = 'localhost';
const port = 3000;

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



app.listen(port, hostname, () => {
  console.log(`Serveur démarré sur http://${hostname}:${port}`); // Affichage d'un message dans la console lorsque le serveur Express démarre
});
}

app.use(express.json())


app.use("/users", usersRoutes)
