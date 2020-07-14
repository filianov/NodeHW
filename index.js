const contactsFunctions = require('./contacts');

const yargs = require('yargs');

// contactsFunctions.removeContact(5);

// contactsFunctions.addContact("mango", "we@gmail.com", "123")

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

