const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const contactsFunctions = require('./contacts');

const yargs = require('yargs');

const app = express();
const PORT = process.env.PORT;

const argv = yargs
    .number('id')
    .string('name')
    .string('email')
    .string('phone')
    .alias('name', 'n')
    .alias('email', 'e')
    .alias('phone', 'p').argv;

function invokeAction({ action, id, name, email, phone }) {
    switch (action) {
        case 'list':
            contactsFunctions.listContacts();
            break;

        case 'get':
            contactsFunctions.getContactById(id)
            break;

        case 'add':
            contactsFunctions.addContact(name, email, phone);
            break;

        case 'remove':
            contactsFunctions.removeContact(id)
            break;

        default:
            console.warn('\x1B[31m Unknown action type!');
    }
}

invokeAction(argv);

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3068" }));
app.use((err, req, res, next) => {
    const { message, status } = err;

    res.status(status || 500).send(message);
});

app.get('/api/contacts', contactsFunctions.listContacts);

app.get('/api/contacts/:contactId', contactsFunctions.getContactById);

app.post('/api/contacts', contactsFunctions.validateCreateContact, contactsFunctions.addContact);

app.delete('/api/contacts/:contactId', contactsFunctions.removeContact);

app.patch('/api/contacts/:contactId', contactsFunctions.validateUpdateContact, contactsFunctions.updateContact)

app.listen(PORT, () => { console.log('Lissening on port', PORT); });


