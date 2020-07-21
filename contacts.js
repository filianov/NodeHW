const fs = require('fs');
const Joi = require('@hapi/joi');
const path = require('path');
const shortId = require('shortid')
const { promises: fsPromises } = fs;
const contactsPath = path.join(__dirname, './db/contacts.json');


async function listContacts(req, res) {
    try {
        const users = await fsPromises.readFile(contactsPath, "utf-8");
        console.log('users', users);
        res.status(200).send(users);
    }
    catch (err) { console.log('err', err) };
};

// listContacts();

async function getContactById(req, res) {
    try {
        const contactId = req.params.contactId;
        console.log('req.params', req.params);
        const users = await fsPromises.readFile(contactsPath, "utf-8");
        const parsedUsers = JSON.parse(users);
        const requestedUser = parsedUsers.find((user) => user.id === contactId);
        if (requestedUser === undefined) {
            const err = await new Error();
            err.status = 404;
            throw err;
        }
        console.log('requestedUser', requestedUser);

        res.status(200).send(requestedUser);
    }
    catch (err) {
        const contactId = req.params.contactId;
        res.status(404).send(`User with id ${contactId} does not exist not found`)

    };
};
// getContactById(8);

async function removeContact(req, res) {
    try {
        const contactId = req.params.contactId;

        const users = await fsPromises.readFile(contactsPath, "utf-8");
        const parsedUsers = await JSON.parse(users);
        const contactsIndex = parsedUsers.findIndex((user) => user.id === contactId);
        if (contactsIndex !== -1) {
            const removedContact = parsedUsers.splice(contactsIndex, 1);
            console.log('removedContact', removedContact);
            const stringified = JSON.stringify(parsedUsers);
            await fsPromises.writeFile(contactsPath, stringified);
            res.status(204).send(`contact deleted`);
        }
        const err = await new Error("contact not found");
        err.status = 404;
        throw err;

    } catch (err) { console.log('err', err) };
};

// removeContact(9)

async function addContact(req, res) {
    try {
        const id = shortId();
        console.log('id', id);
        const newUser = {
            ...req.body,
            id
        };
        console.log('newUser', newUser);
        const users = await fsPromises.readFile(contactsPath, "utf-8");
        const parsedUsers = await JSON.parse(users);
        // console.log('parsedUsers', parsedUsers);
        parsedUsers.push(newUser);
        const stringified = JSON.stringify(parsedUsers);
        await fsPromises.writeFile(contactsPath, stringified);
        res.status(201).send(newUser);
    } catch (err) { console.log('err', err) };
};

async function updateContact(req, res) {
    try {
        const { contactId } = req.params;
        const users = await fsPromises.readFile(contactsPath, "utf-8");
        const parsedUsers = await JSON.parse(users);
        const userIndex = parsedUsers.findIndex((user) => user.id === contactId);
        if (userIndex !== -1) {
            parsedUsers[userIndex] = {
                ...parsedUsers[userIndex],
                ...req.body
            }
        };
        const stringified = JSON.stringify(parsedUsers);
        await fsPromises.writeFile(contactsPath, stringified);
        res.status(200).send(parsedUsers[userIndex]);
    } catch (err) { console.log('err', err) };
};

async function validateCreateContact(req, res, next) {
    try {
        const contactSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required()
        })
        const result = contactSchema.validate(req.body);
        if (result.error) {
            res.status(400).send(result.error)
        }
        next()
    }
    catch (err) { console.log('err', err) };
};

async function validateUpdateContact(req, res, next) {
    try {
        const contactSchema = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            phone: Joi.string()
        }).min(1);
        const result = contactSchema.validate(req.body);
        if (result.error) {
            res.status(400).send(result.error)
        }
        next()
    }
    catch (err) { console.log('err', err) };
};


// addContact('mango', 'we@gmail.com', 123)

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    validateCreateContact,
    validateUpdateContact
};