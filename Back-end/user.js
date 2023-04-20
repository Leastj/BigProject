const mongoose = require('mongoose');

// Création du schéma utilisateur
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

// Création du modèle utilisateur à partir du schéma
const User = mongoose.model('User', userSchema);

// Export du modèle
module.exports = User;