import fs from 'fs/promises';
import path from 'path';
import HttpError from '../helpers/HttpError';
import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas';

const contactsPath = path.join(__dirname, '..', 'db', 'contacts.json');

async function readContactsFile() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

async function writeContactsFile(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await readContactsFile();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contacts = await readContactsFile();
    const contact = contacts.find(contact => contact.id === id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contacts = await readContactsFile();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
      throw HttpError(404, "Not found");
    }
    const [deletedContact] = contacts.splice(index, 1);
    await writeContactsFile(contacts);
    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const validationResult = createContactSchema.validate({ name, email, phone });
    if (validationResult.error) {
      throw HttpError(400, validationResult.error.message);
    }
    const contacts = await readContactsFile();
    const newContact = { id: Date.now().toString(), name, email, phone };
    contacts.push(newContact);
    await writeContactsFile(contacts);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const validationResult = updateContactSchema.validate(updateData);
    if (validationResult.error) {
      throw HttpError(400, validationResult.error.message);
    }
    const contacts = await readContactsFile();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
      throw HttpError(404, "Not found");
    }
    const updatedContact = { ...contacts[index], ...updateData };
    contacts[index] = updatedContact;
    await writeContactsFile(contacts);
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
