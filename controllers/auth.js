import User from '../models/users.js';
import { generateToken } from '../utils/utils.js';
import { checkPassword } from '../utils/utils.js';

export const signupUser = async (req, res) => {
  try {
    console.log(req.body)
    const { pseudo, mail, password } = req.body;

    // Vérifiez que le pseudo et le mail ne sont pas déjà utilisés
    const existingUser = await User.findOne({ $or: [{ pseudo }, { mail }] });
    if (existingUser) {
      res.status(400).json({ message: "Le pseudo ou l'email est déjà utilisé" });
      return;
    }

    // Créez un nouvel utilisateur avec les informations fournies
    const user = new User({ pseudo, mail, password });
    await user.save();

    // Générez un token JWT pour cet utilisateur
    const token = await generateToken(user);

    // Renvoyez le token dans la réponse
    

    res.status(201).json({ id:user._id,token:token });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Une erreur s'est produite lors de la création de l'utilisateur" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { mail, password } = req.body;

    // Vérifiez que l'utilisateur existe et que le mot de passe est correct
    const user = await User.findOne({ mail });
    if (!user) {
      console.log("Utilisateur introuvable !");
      return res.status(401).json({ message: "L'email ou le mot de passe est incorrect" });
    }
    console.log("Utilisateur trouvé :", user);

    const isPasswordCorrect = checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      // Le mot de passe est incorrect
      return res.status(401).json({ message: "L'email ou le mot de passe est incorrect" });
    }
    console.log("Mot de passe correct !");

    // Générez un token JWT pour cet utilisateur
    const token = await generateToken(user);

    // Redirection vers la page profil.html avec le token et l'identifiant

    return res.send({id: user._id, token:token})

/* return res.send({url:`./public/profil.html?id=${user._id}&token=${token}`}) */

    /* return res.redirect(`/public/profil.html?id=${user._id}&token=${token}`); */

  } catch (error) {
    console.log("Erreur lors de la connexion de l'utilisateur :", error);

    return res.status(500).json({ message: "Une erreur s'est produite lors de la connexion de l'utilisateur" });

  }
};

export const logoutUser = (req, res) => {
  // Supprimez le cookie de token JWT en envoyant un nouveau cookie avec une date d'expiration passée
  res.cookie('jwt', '', { maxAge: -1 });

  // Renvoyez une réponse vide avec un statut 204
  return res.status(204).send();
};