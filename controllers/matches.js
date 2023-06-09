import Match from '../models/matches.js';

export const getMatches = async (req, res) => {
    try {
        const matches = await Match.find();
        res.send(matches);
    } catch (error) {
        res.status(500).send(error);
    }
};


export const getAllMatches = async (eventID) => {
    try {
      const matches = await Match.find({ eventID });
      return matches;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des matches.');
    }
  };


export const getMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchID);
        if (!match) {
            return res.status(404).send({ message: 'Match not found' });
        }
        res.send(match);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const createMatch = async (req, res) => {
    try {
        const match = new Match(req.body);
        await match.save();
        res.status(201).send(match);
    } catch (error) {
        res.status(400).send(error);
    }
};


export const updateMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(req.params.matchID, req.body, {
            new: true,
            runValidators: true,
        });
        if (!match) {
            return res.status(404).send({ message: 'Match not found' });
        }
        res.send(match);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndDelete(req.params.matchID);
        if (!match) {
            return res.status(404).send({ message: 'Match not found' });
        }
        res.send(match);
    } catch (error) {
        res.status(500).send(error);
    }
};


export const getOngoingMatches = async (req, res) => {
    try {
        const matches = await Match.find({status: 'ongoing'});
        req.send(matches);
    } catch (error){
        res.status(500).send({message: error.message});
    }
};

export const cancelMatch = async (req, res) => {
    try {
      const match = await Match.findByIdAndUpdate(req.params.matchID, {status: 'cancelled'}, {new: true});
      if (!match) {
        return res.status(404).send({ message: 'Match not found' });
      }
      res.send(match);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  export const finishMatch = async (req, res) => {
    try {
      const match = await Match.findByIdAndUpdate(
        req.params.matchID,
        { finished: true },
        { new: true }
      );
      if (!match) {
        return res.status(404).send({ message: 'Match not found' });
      }
      res.send(match);
    } catch (error) {
      res.status(500).send(error);
    }
  }; 



  // CRÉER joinMatch
  // CRÉER isMatchFull
  // CRÉER addParticipanttoMatch



