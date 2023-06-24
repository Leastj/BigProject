

import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  eventID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  player1: { // <-- User 1 ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  player2: { // <-- User 2 ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  round: {
    type: Number,
  },
  u1score1: {
    type: Number,
    default: null, // <-- Score for User 1
  },
  u1score2: {
    type: Number,
    default: null, // <-- user 1 put score for user 2
  },
  u2score1: {
    type: Number,
    default: null, // <-- Score for User 2
  },
  u2score2: {
    type: Number,
    default: null, // <-- user 2 put score for user 1
  }
});


matchSchema.virtual('isDone').get(function () {
  return this.u1score1 != null && this.u1score2 !== null && this.u2score1 !== null && this.u2score2 !== null
    && this.u1score1 == this.u2score1 && this.u1score2 == this.u2score2
    && this.u1score1 != this.u1score2;
});

matchSchema.virtual('winner').get(function () {
  if (this.isDone) {
    if (this.u1score1 > this.u1score2) {
      return this.player1;
    } else if (this.u1score1 < this.u1score2) {
      return this.player2;
    }
  }
  return null; // Retourner null si le match n'est pas terminé
});

export default mongoose.model('Match', matchSchema);
