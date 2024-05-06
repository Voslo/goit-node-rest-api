import bcrypt from "bcrypt";
import { ImageService } from "../middlewares/upload.js";
import { User } from "../models/userModel.js";

export async function register(data) {
  const user = await User.create(data);
  return user;
}

export async function checkEmail(data) {
  const user = await User.findOne({ email: data });
  return user;
}

export async function generateHash(password) {
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  return newPassword;
}

export async function checkPassword(email, password) {
  const user = await checkEmail(email);
  const isValidPassword = await bcrypt.compare(password, user.password);
  return isValidPassword;
}

export async function findUserById(id) {
  const user = await User.findById(id);
  return user;
}

export async function saveToken(id, token) {
  const result = await User.findByIdAndUpdate(id, { token });
  return result;
}

export async function deleteToken(id) {
  const result = await User.findByIdAndUpdate(id, { token: "" });
  return result;
}

export const updateAvatarImage = async (user, file) => {
  const id = user.id;

  user.avatarURL = await ImageService.saveImage(
    file,
    {
      width: 250,
      height: 250,
    },
    "avatars"
  );

  const currentUser = await User.findByIdAndUpdate(id, user, { new: true });

  return await currentUser.save();
};