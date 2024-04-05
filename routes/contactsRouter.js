import express from "express";
import {
  getAllContacts,
  getOneContact,
  createContact,
  deleteContactNew,
  updateContactNew
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContactNew);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", updateContactNew);

export default contactsRouter;
