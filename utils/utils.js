import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


 // Fonction de génération de token JWT 
 export const  generateToken = async (user) => {


    const userId = user._id;
    const userMail = user.mail;
    const userPseudo = user.pseudo;
    const secret = 'my_secret';
    const token = jwt.sign({ userId, userMail, userPseudo }, secret, { expiresIn: '1h' });
    console.log('token:',token)
    return token;
  } 


// fonction pour vérifier le mot de passe
export const checkPassword = async (password, hash) => {
    if (!hash) {
        throw new Error('Hash not defined');
      }
      const passwordMatch = await bcrypt.compare(password, hash);
      return passwordMatch;
    };

