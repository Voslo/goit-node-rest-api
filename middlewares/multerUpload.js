import { ImageService } from "./upload.js";

export const multerUpload = ImageService.initUploadImageMiddleware("avatar");