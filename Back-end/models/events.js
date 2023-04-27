import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },
    participants: {
        type: Number,
        required: true
    },
    start_date:{
        type: Date,
        required: true
    },
end_date:{
    type: Date,
    required: true
},

    
});

export default mongoose.model('Event', eventSchema);