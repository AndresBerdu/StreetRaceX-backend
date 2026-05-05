import type { Request } from "express";
import cloudinary from "../config/cloudinaryConfiguration.ts";
import type { IMulterRequest } from "../../domain/ports/IMulterRequst.js";

export const uploadImage = async (
  req: IMulterRequest,
  folder: string,
): Promise<{ imageUrl: string; publicId: string } | null> => {
  try {
    if (!req.file) return null;

    const file = req.file;
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(file.buffer);
    });

    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
