import type { Request, Response } from "express";
import { create_vehicle_by_user_slug } from "../../application/vehicle/createVehicleByUserSlug.ts";
import { VehicleSchema } from "../../../vehicle/domain/schemas/VehicleShema.ts";
import { fireOrmVehicleRepository } from "../../../vehicle/infrastructure/adapters/firebase/fireOrmVehicleRepository.ts";
import { get_vehicles_by_user_slug } from "../../application/vehicle/getVehiclesByUserSlug.ts";
import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";
import { generateSlug } from "../../../main/infrastructure/utils/generateSlug.ts";
import { UpdateVehicleShema } from "../../../vehicle/domain/schemas/UpdateVehicleShema.ts";
import { removeUndefinedBoby } from "../../../main/infrastructure/utils/removeUndefinedBoby.ts";
import type { ZodError } from "zod/v4";
import { fireOrmUserRepository } from "../adapters/firebase/fireOrmUserRepository.ts";
import { uploadImage } from "../../../main/infrastructure/utils/uploadImage.ts";
import { delete_vehicle_by_slug_by_user_slug } from "../../application/vehicle/deleteVehicleByVehicleSlugByUserSlug.ts";
import { update_vehicle_by_vehicle_slug_by_user_slug } from "../../application/vehicle/updateVehicleByVehicleSlugByUserSlug.ts";
import { updateImage } from "../../../main/infrastructure/utils/updateImage.ts";

const userVehicleRepository = fireOrmUserRepository();
const vehicleRepository = fireOrmVehicleRepository();

export const getVehiclesByUserSlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    const result = await get_vehicles_by_user_slug(userVehicleRepository)(slug);

    return handleResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "THE_USER_DOESN'T_EXIST") {
        return res.status(404).json({
          ok: false,
          message: "the user doesn't exist",
        });
      }

      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const createVehicleByUserSlug = async (req: Request, res: Response) => {
  try {
    req.body.year = parseInt(req.body.year);

    if (req.body.plate === "null") {
      req.body.plate = null;
    }

    const slug = req.params.slug as string;
    const { vehicle_type, brand, color, model, year, plate, modifications } =
      VehicleSchema.parse(req.body);

    const vehicleData = {
      vehicle_type,
      brand,
      color,
      model,
      year,
      plate,
      modifications,
      slug: generateSlug("vehicle"),
      photo: null,
      public_id_photo: null,
      created_at: new Date(),
    };

    const result = await create_vehicle_by_user_slug(
      userVehicleRepository,
      vehicleRepository,
    )(slug, vehicleData);

    /* Validation for upload the image to cloudinary  */
    if (result.ok && req.file) {
      const imageUrl = await uploadImage(req, "users/vehicle_photos");

      await userVehicleRepository.update_vehicle_by_vehicle_slug_by_user_slug(
        slug,
        result.data.slug,
        {
          photo: imageUrl?.imageUrl,
          public_id_photo: imageUrl?.publicId,
        },
      );

      result.data.photo = imageUrl?.imageUrl ?? null;
      result.data.public_id_photo = imageUrl?.publicId ?? null;
    }

    return handleResponse(res, result);
  } catch (error) {
    if ((error as ZodError)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as ZodError).issues,
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const updateVehicleByVehicleSlugByUserSlug = async (
  req: Request,
  res: Response,
) => {
  try {
    const slug = req.params.slug as string;
    const vehicle_slug = req.params.vehicle_slug as string;
    let newData = UpdateVehicleShema.parse(req.body);

    newData = removeUndefinedBoby(newData);

    const result = await update_vehicle_by_vehicle_slug_by_user_slug(
      userVehicleRepository,
      vehicleRepository,
    )(slug, vehicle_slug, newData);

    /* if file exist you can update photo of vehicle */
    if (result.ok && req.file) {
      const dataImage = await updateImage(
        req.file.buffer,
        result.data.public_id_photo,
        "users/vehicle_photos",
      );

      const resultImage = await update_vehicle_by_vehicle_slug_by_user_slug(
        userVehicleRepository,
        vehicleRepository,
      )(slug, vehicle_slug, {
        photo: dataImage?.imageUrl,
        public_id_photo: dataImage?.publicId,
      });

      return handleResponse(res, resultImage);
    }

    return handleResponse(res, result);
  } catch (error) {
    if ((error as ZodError)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as ZodError).issues,
      });
    }

    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const deleteVehicleByVehicleSlugByUserSlug = async (
  req: Request,
  res: Response,
) => {
  try {
    const slug = req.params.slug as string;
    const vehicle_slug = req.params.vehicle_slug as string;

    const result = await delete_vehicle_by_slug_by_user_slug(
      userVehicleRepository,
      vehicleRepository,
    )(slug, vehicle_slug);

    return handleResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};
