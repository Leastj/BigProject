import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
    },
    numberRound:{
        type: Number,
        required: true
    }

});

export default mongoose.model('Round', roundSchema);