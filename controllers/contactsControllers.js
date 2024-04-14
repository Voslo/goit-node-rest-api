import { Contact } from "../models/contactModel.js";

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(400).json({ message: "Error retrieving contacts", error });
    }
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(400).json({ message: "Error finding contact", error });
    }
};

export const createContact = async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: "Error creating contact", error });
    }
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedContact = await Contact.findByIdAndUpdate(id, req.body);
        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: "Error updating contact", error });
    }
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
            return res.status(404).json({ message: "Not found" });
        }
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting contact", error });
    }
};

export const updateStatusContact  = async (req, res) => {
    const { id } = req.params;
    const { favorite } = req.body;

    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { $set: { favorite, } },
        );

        if (!updatedContact) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: "Error updating contact", error: error.message });
    }
};