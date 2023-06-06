import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },
    participants: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
              return value % 2 === 0; // Vérifie si le nombre est pair
            },
            message: "Le nombre de participants doit être un chiffre pair."
          }
        
    },
    start_date:{
        type: Date,
        required: true
    },
end_date:{
    type: Date,
    required: true
}
    
});

export default mongoose.model('Event', eventSchema);