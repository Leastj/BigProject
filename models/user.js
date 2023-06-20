import mongoose from "mongoose";
import compare from "bcrypt";


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
    },
    token: {
        type: String,
        required: false
    }
});

userSchema.methods.checkPassword = async function (password) {
    const passwordMatch = await compare(password, this.password);
    return passwordMatch;
};

export default mongoose.model('User', userSchema);