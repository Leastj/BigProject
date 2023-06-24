import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    maxParticipants: {
      type: Number,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },

    participantIds: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }],

   
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
  

  });
  
  export default mongoose.model('Event', eventSchema);

