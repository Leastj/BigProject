import express from 'express'
import * as users from '../controllers/users.js'

const router = express.Router();


router.get('/', users.getUsers)
router.get('/:userID', users.getUser)
router.post('/', users.createUser)
router.put('/:userID', users.updateUser)
router.delete('/:userID',users.deleteUser)

export default router

