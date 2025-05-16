import { FileExtensionError } from "../errors/FileExtensionError";
import { Request, Response, NextFunction } from "express";
import multer from "multer";

class ErrorHandler {
  public static handle(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log(error, typeof error);
    if (error instanceof FileExtensionError) {
      return res.status(422).json({ error: error.message });
    }

    if (error) {
      return res
        .status(400)
        .json({ error: error.message || "Erro inesperado." });
    }

    next();
  }
}

export default ErrorHandler;
