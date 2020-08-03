const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userShema = new Schema({

    email: {
        type: String,
        required: true,
        validate: (value) => value.includes('@'),
        trim: true,
        // unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free",
    },
    token: {
        type: String,
        trim: true,
        default: "",
    }
});

const userModel = mongoose.model('Auth', userShema);

module.exports = userModel;