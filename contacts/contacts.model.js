const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactShema = new Schema({
    name: {
        type: String,
        required: true,
        get: (v) => v.toUpperCase(),
    },
    email: {
        type: String,
        required: true,
        validate: (value) => value.includes('@'),
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    subscription: {
        type: String,
        default: 'Free',
    },
    password: {
        type: String,
        required: true,
    },
    token: String,
});


const contactModel = mongoose.model('contats', contactShema);

module.exports = contactModel;