import express from 'express'
import * as rounds from '../controllers/rounds.js'


const router = express.Router();


router.get('/get-rounds',rounds.getRounds)
router.get('/:roundID', rounds.getRound)
router.post('/',rounds.createRound)
router.put('/:roundID' ,rounds.updateRound)
router.get('/ongoing', rounds.getOngoingRounds)
router.delete('/:roundID', rounds.deleteRound)
router.post('/:roundID',rounds.finishRound)
router.get('/finished', rounds.getFinishedRounds)


export default router;
