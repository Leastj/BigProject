import express from 'express'
import * as events from '../controllers/events.js'


const router = express.Router();

router.get('/', events.getEvents)
router.get('/:eventID', events.getEvent)
router.post('/', events.createEvent)
router.put('/:eventID', events.updateEvent)
router.delete('/:eventID',events.deleteEvent)
router.post('/:eventID', events.cancelEvent)
router.post('/:eventID', events.sendInvitation)
router.post('/:eventID', events.finishEvent)


export default router



