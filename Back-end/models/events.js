const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
    },
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

module.exports = mongoose.model('Event', eventSchema);