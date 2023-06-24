import Match from '../models/match.js';



export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.send(matches);
  } catch (error) {
    res.status(500).send(error);
  }
};



export const getMatchById = async (matchId) => {
  try {
    const match = await Match.findById(matchId)
      .populate('player1', 'pseudo')
      .populate('player2', 'pseudo');

    if (!match) {
      throw new Error('Match not found');
    }

    return match;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving match details');
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



export const enterScore = async (req, res) => {
  const { userScore, opponentScore } = req.body;
  const userID = req.user._id;

  try {
    
    if (!event) {
      return res.status(404).json({ message: 'Event introuvable.' });
    }
    
    const match = await Match.findOne({ _id: req.params.matchID, $or: [{ player1: userID }, { player2: userID }] });
    
    if (!match) {
      return res.status(404).json({ message: 'Match introuvable pour cet utilisateur.' });
    }
    
    // Vérifier que les scores de l'utilisateur et de l'adversaire sont différents
    if (userScore === opponentScore) {
      return res.status(400).json({ message: 'Les scores ne peuvent pas être égaux.' });
    }

    const event = await Event.findById(match.eventID);

    // Vérifiez si la date du match est passée
    const now = new Date();
    if (now < event.start_date) {
      res.status(403).json({ message: 'Le match n\'a pas encore commencé. Vous ne pouvez pas entrer de score pour le moment.' });
      return;
    }

    if (now > event.end_date) {
      res.status(403).json({ message: 'La date du match est passée. Vous ne pouvez plus entrer de score.' });
      return;
    }

    // Vérifie si le match est déjà terminé
    if (match.isDone) {
      res.status(400).json({ message: 'Ce match est déjà terminé.' });
      return;
    }

    // Met à jour les scores en fonction de l'ID de l'utilisateur
    if (match.player1.toString() === userID) {
      match.u1score1 = userScore;
      match.u1score2 = opponentScore;
      console.log(`Player 1 Score: ${userScore}, Opponent Score: ${opponentScore}`);
    } else {
      match.u2score1 = userScore;
      match.u2score2 = opponentScore;
      console.log(`Player 2 Score: ${userScore}, Opponent Score: ${opponentScore}`);
    }

    await match.save();

    if (!match.isDone) {
      if (match.u1score1 == null || match.u2score1 == null) {
        res.json({ message: `Score enregistrés, en attente de ceux de l'adversaire.` });
      } else {
        res.json({ message: `Les scores ne corespondent pas avec ceux saisis par votre adversaire. Mettez vous d'accord.` });
      }
      return
    }

    // Gestion nombre impairs, on oublie pour le moment

    // Je récupére le round suivant
    // Chercher le premier match qui n'est pas complet
    const nextMatch = await Match.find({ eventID: event._id, round: match.round + 1, player2: null });
    const winnerId = match.winner;

    if (!nextMatch) {
      // Aucun match disponible, créer un nouveau match
      const newMatch = new Match({
        eventID: event._id,
        player1: winnerId,
        round: match.round + 1
      });
      const match = await newMatch.save();
      event.matches.push(match._id);
      await event.save();

      console.log(`User "${winnerId}" joined match "${match._id}" as PLAYER1`);
    } else {
      // Au moins un match disponible, choisir le premier match disponible
      nextMatch.player2 = winnerId;
      await nextMatch.save();

      console.log(`User "${winnerId}" joined match "${match._id}" as PLAYER2`);

    }
    res.status(200).json({ message: 'Scores enregistrés avec succès. Le match est terminé.', winner: winnerId });
    return
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


