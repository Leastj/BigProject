import Round from '../models/rounds.js';

// GET /rounds : Récupère une liste de tous les tours

export const getRounds = async (req, res) => {
    try {
      const rounds = await Round.find();
      res.send(rounds);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  // GET /rounds/{id} : Récupère les détails du tour avec l'ID
export const getRound = async (req, res) => {
    try {
      const round = await Round.findById(req.params.id);
      if (!round) {
        return res.status(404).send({ message: 'Round not found' });
      }
      res.send(round);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  // POST /rounds : Crée un nouveau tour
export const createRound = async (req, res) => {
    try {
      const round = new Round(req.body);
      await round.save();
      res.send(round);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  // PUT /rounds/{id} : Met à jour les détails du tour avec l'ID
export const updateRound = async (req, res) => {
    try {
      const round = await Round.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!round) {
        return res.status(404).send({ message: 'Round not found' });
      }
      res.send(round);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  // GET /rounds/ongoing : Récupère une liste des tours en cours
export const getOngoingRounds = async (req, res) => {
    try {
      const rounds = await Round.find({ isFinished: false });
      res.send(rounds);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  // DELETE /rounds/{id} : Supprime le tour avec l'ID
export const deleteRound = async (req, res) => {
    try {
      const round = await Round.findByIdAndDelete(req.params.id);
      if (!round) {
        return res.status(404).send({ message: 'Round not found' });
      }
      res.send(round);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  // POST /rounds/{id}/finish : Marque le tour avec l'ID comme terminé
export const finishRound = async (req, res) => {
    try {
      const round = await Round.findByIdAndUpdate(
        req.params.id,
        { isFinished: true },
        { new: true }
      );
      if (!round) {
        return res.status(404).send({ message: 'Round not found' });
      }
      res.send(round);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  // GET /rounds/finished : Récupère une liste des tours terminés
export const getFinishedRounds = async (req, res) => {
    try {
      const rounds = await Round.find({ isFinished: true });
      res.send(rounds);
    } catch (error) {
      res.status(500).send(error);
    }
  };


