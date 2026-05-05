import type { Request } from "express";
import type { File } from "multer";

export interface IMulterRequest extends Request {
  file?: Express.Multer.File;
}