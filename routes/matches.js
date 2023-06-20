import express from 'express'
import * as matches from '../controllers/matches.js'

const router = express.Router();

router.get("/", matches.getMatches);
router.get("/:matchID", matches.getMatch);
router.post("/", matches.createMatch);
router.put("/:matchID", matches.updateMatch);
router.delete("/:matchID", matches.deleteMatch);
router.get("/ongoing", matches.getOngoingMatches);
router.post("/:matchID/cancel", matches.cancelMatch);
router.post("/:matchID/finish", matches.finishMatch);


export default router


