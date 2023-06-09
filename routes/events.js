import express from 'express'
import * as events from '../controllers/events.js'


const router = express.Router();

router.get('/', events.getEvents)
router.get('/:eventID', events.getEvent)
router.post('/', events.createEvent)
router.post('/:eventID/participate',events.participateEvent)
router.put('/:eventID', events.updateEvent)
router.delete('/:eventID',events.deleteEvent)
router.post('/:eventID/invite/:userID', events.sendInvitation)


export default router



