import { FileExtensionError } from "../errors/FileExtensionError";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, `${file.originalname.split('.')[0]}-${Date.now()}.txt`);
  },
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (fileExtension !== ".txt") {
    return cb(new FileExtensionError("Only .txt files are accepted"));
  }
  cb(null, true);
}

export const fileUploadTxt = multer({ storage, fileFilter });
