const express = require('express');
const mongoose = require('mongoose');


// Connexion au serveur 
const app = express(); // Création d'une instance de l'application Express
const hostname = 'localhost';
const port = 3000;

main().catch(err => console.log(err));


// code de connexion à Mongoose 
// remplacer mongodb://127.0.0.1:27017/test par l'URL de connexion.
async function main() {
  await mongoose.connect('mongodb://127.0.0.1/test', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connexion à la base de données réussie'); // Affichage d'un message dans la console si la connexion à la base de données est réussie
}

app.listen(port, hostname, () => {
  console.log(`Serveur démarré sur http://${hostname}:${port}/`); // Affichage d'un message dans la console lorsque le serveur Express démarre
});