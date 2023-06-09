import Event from '../models/events.js';
import { createMatch, getAllMatches } from './matches.js';
import { createRound } from './rounds.js';


export const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.send(events);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.userID);
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }
        res.send(event);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
};


export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.eventID, req.body, {
            new: true,
            runValidators: true,
        });
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }
        res.send(event);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.eventID);
        if (!event) {
            res.status(404).send({ message: 'Event not found' });
            return
        }
        res.send(true);
    } catch (error) {
        res.status(500).send(error);
    }
};


export const cancelEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
          req.params.eventID,
          { status: 'cancelled' },
          { new: true }
        );
        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    
    export const sendInvitation = async (req, res) => {
        try {
          const event = await Event.findById(req.params.eventID);
          if (!event) {
            return res.status(404).json({ error: 'Event not found' });
          }

          // CODE POUR ENVOYER L'INVITATION
          
          res.status(200).json({ message: 'Invitation sent successfully' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };

    export const finishEvent = async (req, res) => {
        try {
          const event = await Event.findByIdAndUpdate(
            req.params.eventID,
            { status: 'finished' },
            { new: true }
          );
          if (!event) {
            return res.status(404).json({ error: 'Event not found' });
          }
          res.status(200).json(event);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };

// FONCTION VÉRIFICATION EVENT FULL

export const isEventFull = async (req, res) => {
  try {
    const event = await Event.findById(eventID);
    if(!event){
      throw new Error ('Event not find');
    }

  const participantsCount = await matches.countDocuments({
    eventID: event,
  });
  return participantsCount >= event.maxParticipants;
  } catch (error) {
    throw new error ('Failed to check event availability');
  }
 };


// FONCTION POUR PARTICIPER À L'ÉVÉNEMENT

      //router.post('/:eventID/participate',events.participate) 

      export const participateEvent = async (req, res) => {
        try {
          const userId = req.user.id;
          const eventId = req.params.eventID;
      
          const matches = await getAllMatches(eventId);
      
          while (!isEventFull(eventId)) {
            if (matches.length === 0 || isMatchFull(matches[matches.length - 1])) {
              const newMatchID = await createMatch(eventId);
              await joinMatch(newMatchID, userId, 'player1');
            } else {
              const lastMatch = matches[matches.length - 1];
              await joinMatch(lastMatch.id, userId, 'player2');
            }
      
            matches = await getAllMatches(eventId); // actualiser la liste de matchs après chaque ajout de participants
          }
      
          // Vérifier si le tournoi est complet
          if (isEventFull(eventId)) {
            return res.status(200).json({ message: 'Tournoi complet !' });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Erreur lors de la participation à l\'événement.' });
        }
      };

      /* 
      
      */
    

// REJOINDRE UN MATCH OU CRÉER UN NOUVEAU MATCH SI COMPLET JUSQU'À MAX PARTICIPANT
