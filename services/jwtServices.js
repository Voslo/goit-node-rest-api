import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import HttpError from "../helpers/HttpError.js";

dotenv.config();

const { JWT_SECRET_KEY, JWT_EXPIRE_IN } = process.env;

export const loginToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE_IN });
};

export const checkToken = (token) => {
  if (!token) {
    throw HttpError(401, "Unauthorized");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET_KEY);

    return id;
  } catch (error) {
    throw HttpError(401, "Unauthorized");
  }
};