import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({

scoreUser1:{
    type: Number,
    required: true
},
scoreUser2:{
    type: Number,
    required: true
}

});

export default mongoose.model('Match', matchSchema);
