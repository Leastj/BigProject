import Event from '../models/event.js';
// Ça c'ets caca boudin, c'est de la logique de modèle, pas de controller
// Donc comme tu utilise une library, hé bien tu l'utilise telle qu'elle
// Ou alors tu rajoute ces fonctions dans ton modèle et tu les importes depuis ton modèle 
// mais vu ce que tu y faisait, je ne pense pas que ce soit la peine
//import {getMatchesByEventId,createMatch, isMatchFull} from './matches.js';
import {getMatchesByEventId,createMatch, isMatchFull} from './matches.js';
import Match from '../models/match.js';



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
}

// FONCTION VÉRIFICATION EVENT FULL

export const isEventFull = async (eventId) => {
  console.log(eventId)
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    console.log(1)
    const matches = await getMatchesByEventId(eventId);
    console.log(2)

    const participantsCount = matches.length;
    console.log(3)

    return participantsCount >= event.maxParticipants;
  } catch (error) {
    console.error(error);
    // Throw the original error message
    throw error;
  }
};









// FONCTION POUR PARTICIPER À L'ÉVÉNEMENT
export const participateEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.eventID;

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: `L'évènement d'id ${eventId} n'a pas pu être trouvé` });
      return;
    }

    const matches = await Match.find({ eventID: eventId }); // Récupère les matches de l'événement

    // Vérifier si le nombre maximal de participants est atteint
    const participantsSet = new Set();
    matches.forEach(match => {
      if (match.player1) {
        participantsSet.add(match.player1.toString());
      }
      if (match.player2) {
        participantsSet.add(match.player2.toString());
      }
    });

    if (participantsSet.size >= event.maxParticipants) {
      
      res.status(403).json({ message: `Évènement complet, le nombre maximal de participants a été atteint` });
      return;
    }

    // Vérifier si la date de début de l'événement est dépassée
    const now = new Date();
    if (now >= event.start_date) {
      
      res.status(403).json({ message: `Inscriptions fermées, l'évènement a déjà commencé` });
      return;
    }

    // Vérifier si l'utilisateur est déjà inscrit à l'événement
    if (participantsSet.has(userId.toString())) {
      res.status(403).json({ message: `Vous êtes déjà inscrit à cet événement` });
      return;
    }

    // Cherche le premier match où l'utilisateur n'est pas déjà enregistré et qui n'est pas complet
    let availableMatch = matches.find(match => match.player1 && !match.player2);

    if (!availableMatch) {
      // Aucun match disponible, créer un nouveau match
      const newMatch = new Match({
        eventID: eventId,
        player1: userId,
        scoreUser1: 0,
        scoreUser2: 0,
      });
      const match = await newMatch.save();
      event.matches.push(match._id);
      await event.save();
    
      console.log(`User "${userId}" joined match "${match._id}" as PLAYER1`);
    } else {
      // Au moins un match disponible, choisir le premier match disponible
      availableMatch.player2 = userId;
      await availableMatch.save();
    
      console.log(`User ${userId} joined match ${availableMatch._id} as PLAYER2`);
    }

    res.status(200).json({ message: 'Participation réussie.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Une erreur inattendue s'est produite. Veuillez réessayer` });
  }
};








