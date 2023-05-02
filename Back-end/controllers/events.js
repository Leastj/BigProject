import Event from '../models/events.js';

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
            return res.status(404).send({ message: 'Event not found' });
        }
        res.send(event);
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