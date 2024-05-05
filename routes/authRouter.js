import express from "express";

import validateBody from "../helpers/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../schemas/userSchemas.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrent,
  updateAvatar
} from "../controllers/usersControllers.js";
import authenticate from "../middlewares/authMiddlewares.js";
import { multerUpload } from "../middlewares/multerUpload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), registerUser);

authRouter.post("/login", validateBody(loginUserSchema), loginUser);

authRouter.post("/logout", authenticate, logoutUser);

authRouter.get("/current", authenticate, getCurrent);

authRouter.patch('/avatars', authenticate, multerUpload, updateAvatar);

export default authRouter;