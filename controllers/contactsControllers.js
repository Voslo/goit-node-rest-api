import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateById,
  updateStatusContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const result = await listContacts();

  res.status(200).json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await getContactById(id);

  if (!result) {
    throw HttpError(404, "Not Found");
  }

  res.status(200).json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);

  if (!result) {
    throw HttpError(404, "Not Found");
  }

  res.status(200).json(result);
};

export const createContact = async (req, res) => {
  const result = await addContact(req.body);

  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  if (Object.keys(req.body).length < 1) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;
  const result = await updateById(id, req.body);

  if (!result) {
    throw HttpError(404, "Not Found");
  }

  res.status(200).json(result);
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const result = await updateStatusContact(id, req.body);

  if (!result) {
    throw HttpError(404, "Not Found");
  }

  res.status(200).json(result);
};