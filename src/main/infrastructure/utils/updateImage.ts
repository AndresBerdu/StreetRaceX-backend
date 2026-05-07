import cloudinary from "../config/cloudinaryConfiguration.ts";
import streamifier from "streamifier";

export const updateImage = async (
  fileBuffer: Buffer,
  oldPublicId: string | null,
  folder: string,
): Promise<{ imageUrl: string; publicId: string }> => {

  if (oldPublicId) {
    await cloudinary.uploader.destroy(oldPublicId);
  }

  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });

  return {
    imageUrl: result.secure_url,
    publicId: result.public_id,
  };
};
