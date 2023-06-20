import Match from '../models/match.js';
import Event from '../models/event.js';
import { getUser } from './users.js';

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.send(matches);
  } catch (error) {
    res.status(500).send(error);
  }
};


// Oui ok, alors juste tu supprimes cette fonction et tu utilises la ligne 19 quand t'en a besoin où t'en a besoin
export const getMatchesByEventId = async (eventID) => {
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

export const createMatch = async ({ eventID }) => {
  try {
    const newMatch = new Match({ eventID, scoreUser1: 0, scoreUser2: 0, status: 'ongoing' });
    await newMatch.save();
    return newMatch;
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la création d\'un match.');
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
    const matches = await Match.find({ status: 'ongoing' });
    res.send(matches);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const cancelMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.matchID, { status: 'cancelled' }, { new: true });
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


// @TODO idem pour cette fonciton (mais de toute façon tu vera que je t'ai modifier le code de manière à ne pas en avoir besoin)
export const isMatchFull = (match) => {
  return match.player1 && match.player2;
};