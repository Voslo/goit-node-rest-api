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
  updateAvatarImage
} from "../services/usersServices.js";
import { loginToken } from "../services/jwtServices.js";
import { User } from "../models/userModel.js";

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

export const updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }
  const user = await updateAvatarImage(req.user, req.file);

  res.status(200).json({
    avatarURL: user.avatarURL,
  });
});