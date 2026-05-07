import cloudinary from "../config/cloudinaryConfiguration.ts";

export const deleteImage = async (publicId: string): Promise<void> => {
  if (!publicId) return;
  
  await cloudinary.uploader.destroy(publicId);
};