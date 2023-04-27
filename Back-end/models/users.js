import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model('User', userSchema);