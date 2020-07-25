const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const contactsRouter = require('./contacts/contacts.router');

// const yargs = require('yargs');

const app = express();
const PORT = process.env.PORT;

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3068" }));

app.use('/api/contacts', contactsRouter)

app.use((err, req, res, next) => {
    const { message, status } = err;

    res.status(status || 500).send(message);
});

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
    if (err) { process.exit(1) }
    console.log("Database connection successful");
});

app.listen(PORT, () => { console.log('Lissening on port', PORT); });


