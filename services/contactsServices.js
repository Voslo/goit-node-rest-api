const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname,'db','contacts.json');

async function listContacts() {
    const contacts= await fs.readFile(contactsPath)
    return JSON.parse(contacts);
  }
  
  async function getContactById(contactId) {
    const contacts = await listContacts();
    return contacts.find((contact) =>contact.id===contactId)|| null;
  }
  
  async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId)

    if(index!==-1){
        const [removeContact] = contacts.splice(index, 1);
        await fs.writeFile(contactsPath, JSON.stringify(contacts))
        return removeContact
    }
    return null;
  }
  
  async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {
        id:Date.now().toString(),
        name,
        email,
        phone,
    }
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return newContact;
  }

module.exports={
    listContacts,
    getContactById,
    removeContact,
    addContact,
}