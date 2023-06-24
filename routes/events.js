import express from 'express'
import * as events from '../controllers/events.js'
import * as matchesController from '../controllers/matches.js'


const router = express.Router();

router.get('/', events.getEvents)
router.get('/:eventID', events.getEvent)
router.get('/detailMatch/:eventID', events.getEventById)
router.post('/', events.createEvent)
router.post('/participate/:eventID', events.participateEvent)
router.put('/update/:eventID', events.updateEvent)
router.delete('/:eventID', events.deleteEvent)
router.post('/:eventID/invite/:userID', events.sendInvitation)
  
  
  
  
  
  
  




export default router



