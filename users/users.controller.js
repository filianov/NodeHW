const bcryptjs = require('bcryptjs');
const User = require('./users.model');
const { verificationEmail } = require('./emailing.client');
const jwt = require("jsonwebtoken");
const Avatar = require('avatar-builder');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const multer = require('multer');
const uuid = require("uuid");

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

const getUsers = async (req, res, next) => {
    try {
        const usersList = await User.find();
        res.send(usersList);
    } catch (err) { next(err); }
};

async function sendVerificationEmail(user) {
    const { email, verificationToken } = user;

    const verificationLink = `http://localhost:3068/auth/verify/${verificationToken}`;
    await verificationEmail(email, verificationLink);
};

const createUser = async (req, res) => {
    try {
        const { password, email, subscription, avatarURL, verificationToken, } = req.body;

        const candidate = await User.findOne({ email });

        if (candidate) {
            res.status(400).send('Email in use');
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        const url = path.join('http://localhost:3068/static/images/', `${email}.png`);

        console.log('url', url)

        const avatar = Avatar.builder(Avatar.Image.margin(Avatar.Image.circleMask(Avatar.Image.identicon())), 128, 128);

        await avatar.create('gabriel').then(buffer => fs.writeFileSync(`./tmp/${email}.png`, buffer));

        fse.move(`./tmp/${email}.png`, `./public/images/${email}.png`, function (err) {
            if (err) return console.error(err)
            console.log("success!")
        });

        const newUser = new User({ email, subscription: subscription, password: hashPassword, avatarURL: url, verificationToken: uuid.v4(), });

        const userInDb = await newUser.save();

        await sendVerificationEmail(newUser);

        res.status(201).send(
            {
                id: userInDb._id,
                subscription,
                avatarURL,
                email,
                verificationToken
            });
    }
    catch (err) {
        res.status(500).send('something wrong in db' + err);
    };
};

const loginUser = async (req, res) => {
    try {
        const { password, email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).send(`User with email ${email} not found`)
        }
        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            res.status(401).send('your pass is wrong');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        await User.findByIdAndUpdate({ _id: user.id }, { $set: { token: token } }, { new: true });

        res.json({ token, user });

    } catch (err) {
        res.status(500).send('something wrong - ' + err);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const { token } = req.user;
        console.log('req.user', req.user)
        // console.log('token', token)
        const user = await User.findOne({ token });
        if (user.token !== token) {
            return res.status(400).send(`token not match`)
        }
        return res.status(200).send(req.user);
    } catch (err) { next(err); }
};

const addAvatarToCurrentUser = async (req, res, next) => {
    try {
        const { token } = req.user;
        const avatar = req.file.path;
        console.log('token', token)
        console.log('req.file', req.file)

        const user = await User.findOneAndUpdate({ token: token }, { $set: { avatarURL: `http://localhost:3068/${avatar}` } }, { new: true });
        console.log('user', user)
        if (user.token !== token) {
            res.status(400).send(`token not match`)
        } res.status(200).send(user.avatarURL);
    } catch (err) { next(err); }
};

const verifyUser = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;

        const user = await User.findOneAndUpdate(
            { verificationToken },
            {
                verificationToken: null,
            }
        );
        if (!user) {
            return res.status(404).send("User not found");
        }
        return res.status(200).send("You are verified");
    } catch (err) { next(err); };
};


const logOut = async (req, res, next) => {
    try {
        const id = req.user._id;
        console.log('id', id)
        const user = await User.findByIdAndUpdate({ _id: id }, { $set: { token: null } }, { new: true });
        res.status(204).send(`you are logout`);
    } catch (err) { next(err); }
};

module.exports = {
    createUser,
    loginUser,
    getCurrentUser,
    logOut,
    getUsers,
    addAvatarToCurrentUser,
    upload,
    verifyUser,
};