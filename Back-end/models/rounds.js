import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
    
    numberRound:{
        type: Number,
        required: true
    }

});

export default mongoose.model('Round', roundSchema);