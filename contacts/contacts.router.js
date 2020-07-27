const { Router } = require('express');

const contactsFunctions = require('./contacts.controllers');

const { validateCreateContact, validateUpdateContact } = require('../helpers/validate');


const contactsRouter = Router();

contactsRouter.get('/', contactsFunctions.getContacts);

contactsRouter.get('/:contactId', contactsFunctions.getContact);

contactsRouter.post('/', validateCreateContact, contactsFunctions.createContact);

contactsRouter.delete('/:contactId', contactsFunctions.deleteContact);

contactsRouter.patch('/:contactId', validateUpdateContact, contactsFunctions.updateContact);

module.exports = contactsRouter;