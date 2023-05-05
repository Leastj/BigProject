import express from 'express'
import * as auth from '../controllers/auth.js';


const router = express.Router();

router.post('/signup', auth.signupUser);
router.post('/login', auth.loginUser);
router.post('/logout',auth.logoutUser);

export default router;


