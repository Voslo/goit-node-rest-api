import HttpError from '../helpers/HttpError.js';
import contactsSchema from '../schemas/contactsSchemas.js';
import {addContact, deleteContact, getContactById, listContacts, updateContact} from '../services/contactsServices.js';

export const getAllContacts = async (req, res) => {
    try {
    const contacts = await listContacts()
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json('Error occured');
    }
};

export const getOneContact = async (req, res) => {
    const {id} = req.params;
    try {
        const contact = await getContactById(id);
        if (!contact){
            throw HttpError(404, "Not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json('Error occured');
    }
};

export const deleteContactNew = async (req, res) => {
    const {id} = req.params;
    try {
        const deletedContact = await deleteContact(id);
        if (!deletedContact) {
            throw HttpError(404, "Not found");
          }
        res.status(200).json(deletedContact);
    } catch (error) {
        res.status(500).json('Error occured');
    }
};

export const createContact = async (req, res) => {
    const {name, email, phone} = req.body;
    try {
        const validationResult = contactsSchema.create.validate({ name, email, phone });
    if (validationResult.error) {
      throw HttpError(400, validationResult.error.message);
    }
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json('Error occured');
    }
};

export const updateContactNew = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const validationResult = contactsSchema.update.validate(updateData);
        if (validationResult.error) {
          throw HttpError(400, validationResult.error.message);
        }
        const updatedContact = await updateContact(id, updateData);
        if (!updatedContact) {
          throw HttpError(404, "Not found");
        }
        res.status(200).json(updatedContact);
      } catch (error) {
        res.status(500).json('Error occured');
      }
};
