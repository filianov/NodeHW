const fs = require('fs');
const path = require('path');
const shortId = require('shortid')
const { promises: fsPromises } = fs;
const contactsPath = path.join(__dirname, './db/contacts.json');


async function listContacts() {
    try {
        const users = await fsPromises.readFile(contactsPath, "utf-8");
        console.log('users', users);
    }
    catch (err) { console.log('err', err) };
};

// listContacts();

async function getContactById(contactId) {
    try {
        const users = await fsPromises.readFile(contactsPath, "utf-8");
        const parsedUsers = JSON.parse(users);
        const requestedUser = parsedUsers.filter((user) => user.id === contactId);
        console.log('requestedUser', requestedUser);
    }
    catch (err) { console.log('err', err) };
};

// getContactById(8);

async function removeContact(contactId) {
    try {
        const users = await fsPromises.readFile(contactsPath, "utf-8");
        const parsedUsers = await JSON.parse(users);
        const usersWithRemoveOperation = parsedUsers.filter((user) => user.id !== contactId);
        console.log('usersWithRemoveOperation', usersWithRemoveOperation);
        const stringified = JSON.stringify(usersWithRemoveOperation);
        // console.log('stringified', stringified);
        await fsPromises.writeFile(contactsPath, stringified);
    }
    catch (err) { console.log('err', err) };
};

// removeContact(9)

async function addContact(name, email, phone) {
    try {
        const id = shortId();
        console.log('id', id);
        const newUser = {
            id,
            name,
            email,
            phone
        };
        console.log('newUser', newUser);
        const users = await fsPromises.readFile(contactsPath, "utf-8");
        const parsedUsers = await JSON.parse(users);
        // console.log('parsedUsers', parsedUsers);
        parsedUsers.push(newUser);
        const stringified = JSON.stringify(parsedUsers);
        await fsPromises.writeFile(contactsPath, stringified);
    } catch (err) { console.log('err', err) };
}

// addContact('mango', 'we@gmail.com', 123)

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
};

