const mongoose = require ('mongoose');

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
module.exports = mongoose.model('Round', roundSchema);