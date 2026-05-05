import cloudinary from "../config/cloudinaryConfiguration.ts";
import streamifier from "streamifier"

export const updateImage = async (
  fileBuffer: Buffer,
  oldPublicId: string | null,
  folder: string
): Promise<{ imageUrl: string; publicId: string }> => {
  const uploadOptions: Record<string, any> = { folder };

  if (oldPublicId) {
    uploadOptions.public_id = oldPublicId;
    uploadOptions.overwrite = true;       
  }

  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });

  return {
    imageUrl: result.secure_url,
    publicId: result.public_id,
  };
};