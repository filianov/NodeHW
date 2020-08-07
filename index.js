const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const multer = require('multer');

const usersRouter = require('./users/users.router');

const contactsRouter = require('./contacts/contacts.router');

const storage = multer.diskStorage({
    destination: './public/images',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb('Type file is not accepted', false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: 5
});

const app = express();
const PORT = process.env.PORT;

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3068" }));

app.use('/auth', usersRouter);

app.use('/api/contacts', contactsRouter);

app.use('/public', express.static('public'));

app.post(
    '/upload',
    upload.single('avatar'),
    (req, res, next) => {
        res.status(200).send('File uploaded!');
    }
);

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


