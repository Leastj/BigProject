const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
id:{
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId
},
scoreUser1:{
    type: Number,
    required: true
},
scoreUser2:{
    type: Number,
    required: true
}

});

module.exports = mongoose.model('Match', matchSchema);
