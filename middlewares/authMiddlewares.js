import HttpError from "../helpers/HttpError.js";
import catchAsync from "../helpers/catchAsync.js";
import { checkToken } from "../services/jwtServices.js";
import { findUserById } from "../services/usersServices.js";

const authenticate = catchAsync(async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  const id = checkToken(token);
  const user = await findUserById(id);

  if (!user || !user.token || user.token !== token) {
    next(HttpError(401, "Not authorized"));
  }

  req.user = user;

  next();
});

export default authenticate;