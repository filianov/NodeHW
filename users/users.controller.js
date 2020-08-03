const bcryptjs = require('bcryptjs');
const User = require('./users.model');
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
    try {
        const usersList = await User.find();
        res.send(usersList);
    } catch (err) { next(err); }
};

const createUser = async (req, res) => {
    try {
        const { password, email, subscription } = req.body;

        const candidate = await User.findOne({ email });

        if (candidate) {
            res.status(400).send('Email in use');
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({ email, subscription: subscription, password: hashPassword });

        const userInDb = await newUser.save();

        res.status(201).send(
            {
                id: userInDb._id,
                subscription,
                email,
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
    getUsers
};