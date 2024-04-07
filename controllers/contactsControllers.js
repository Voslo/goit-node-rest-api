import { addContact, getContactById, listContacts, removeContact, updateContactById } from "../services/contactsServices.js";

export const getAllContacts = async(req, res, next) => {
   const getUsers = await listContacts();
    res.status(200).json(getUsers);
};

export const getOneContact = async(req, res) => {
    const { id } = req.params;
    const contact = await getContactById(id);
    
  if (!contact) {
   res.status(404).json({"message": "Not found"})
    }
  res.status(200).json(contact)
};

export const deleteContact = async(req, res) => {
    const { id } = req.params;
    const removedContact = await removeContact(id);

    if (!removedContact) {
       return res.status(404).json({"message": "Not found"})
         }
       res.status(200).json(removedContact)
};

export const createContact = async(req, res) => {

const createNewContcat = await addContact(req.body);

    res.status(201).json(createNewContcat);
};

export const updateContact = async(req, res) => {
const { id } = req.params;
if (Object.keys(req.body).length === 0) {
   return res.status(400).json({"message": "Body must have at least one field"})
}
const updateContacts = await updateContactById(id, req.body);
if (!updateContacts) {
   return res.status(404).json({"message": "Not found"})
};

res.status(200).json(updateContacts);
};
