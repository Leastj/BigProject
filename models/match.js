

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
    scoreUser1: {
      type: Number,
      default: 0, // <-- Score for User 1
    },
    scoreUser2: {
      type: Number,
      default: 0, // <-- Score for User 2
    }
  });
  
  export default mongoose.model('Match', matchSchema);
