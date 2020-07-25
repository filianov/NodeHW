const Contact = require('./contacts.model');

async function getContacts(req, res, next) {
    try {
        const contactsList = await Contact.find();
        res.send(contactsList);
    } catch (err) { next(err); }
};

async function getContact(req, res, next) {
    try {
        const { contactId } = req.params;

        const requestedContact = await Contact.findById(contactId);

        if (!requestedContact) {
            const err = new Error(`User with id ${contactId} does not exist`);
            err.status = 404;
            throw err;
        }

        res.send(requestedContact);
    } catch (err) { next(err); }
};

async function createContact(req, res, next) {
    try {
        const newContact = await Contact.create({ ...req.body });

        res.status(201).send(newContact);
    } catch (err) {
        next(err);
    }
};

async function updateContact(req, res, next) {
    try {
        const { contactId } = req.params;
        const contactUpdate = await Contact.findOneAndUpdate({ _id: contactId }, { $set: { ...req.body } }, { new: true });
        (!contactUpdate) ? res.status(404).send(`User with id ${contactId} does not exist`) : res.send(contactUpdate);
    } catch (err) {
        next(err);
    }
};

async function deleteContact(req, res, next) {
    try {
        const { contactId } = req.params;
        const contactDelete = await Contact.findOneAndDelete({ _id: contactId });
        res.send(contactDelete);
    } catch (err) {
        next(err);
    }
};

module.exports = { getContacts, getContact, createContact, updateContact, deleteContact }
