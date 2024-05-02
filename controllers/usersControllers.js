import catchAsync from "../helpers/catchAsync.js";
import HttpError from "../helpers/HttpError.js";
import gravatar from 'gravatar';
import {
  register,
  checkEmail,
  generateHash,
  checkPassword,
  saveToken,
  deleteToken,
} from "../services/usersServices.js";
import { loginToken } from "../services/jwtServices.js";
import { User } from "../models/userModel.js";
import path from "path";
export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }
  const avatarURL = gravatar.url(email);

  const hashPassword = await generateHash(password);

  const newUser = await register({ ...req.body, avatarURL, password: hashPassword });

  if (!newUser) {
    throw HttpError(404, 'Not found');
  }
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await checkEmail(email);

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await checkPassword(email, password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = loginToken(user._id);
  await saveToken(user._id, token);

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const logoutUser = catchAsync(async (req, res) => {
  const { _id } = req.user;

  await deleteToken(_id);

  res.status(204).json();
});

export const getCurrent = catchAsync(async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
});

export const updateAvatar = async (req, res) => {
   if (!req.file) {
   throw HttpError(400, "No file provided");
  }

  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  const newPath = path.join(avatarsPath, filename);

  Jimp.read(oldPath, (err, img) => {
    if (err) throw err;
    img.resize(250, 250).write(newPath);
  });

  await fs.rename(oldPath, newPath);

  const avatarURL = path.join('avatars', filename);
  await authServices.setAvatar(_id, avatarURL);
  return res.json({ avatarURL });
};