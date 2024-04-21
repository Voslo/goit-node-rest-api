import HttpError from "../helpers/HttpError.js";
import catchAsync from "../helpers/catchAsync.js";
import { checkToken } from "../services/jwtServices.js";
import { findUserById } from "../services/usersServices.js";

const authenticate = catchAsync(async (req, res, next) => {
    const { authorization = "" } = req.headers;
    if (!authorization.startsWith("Bearer ")) {
        return next(new HttpError(401, "Not authorized"));
    }

    const token = authorization.split(" ")[1];
    try {
        const userId = checkToken(token);
        if (!userId) {
            return next(new HttpError(401, "Not authorized"));
        }

        const user = await findUserById(userId);
        if (!user || user.token !== token) {
            return next(new HttpError(401, "Not authorized"));
        }

        req.user = user;
        next();
    } catch (error) {
        next(new HttpError(401, "Not authorized: " + error.message));
    }
});

export default authenticate;
