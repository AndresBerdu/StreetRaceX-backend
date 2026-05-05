import type { Request, Response } from "express";
import { create_vehicle_by_user_slug } from "../../application/vehicle/createVehicleByUserSlug.ts";
import { VehicleSchema } from "../../../vehicle/domain/schemas/VehicleShema.ts";

import { fireOrmVehicleRepository } from "../../../vehicle/infrastructure/firebase/fireOrmVehicleRepository.ts";
import { get_vehicles_by_user_slug } from "../../application/vehicle/getVehiclesByUserSlug.ts";
import { update_vehicle_with_plate_by_user_slug } from "../../application/vehicle/updateVehicleWithPlateByUserSlug.ts";
import { fireOrmUserRepository } from "../firebase/fireOrmUserRepository.ts";
import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";
import { generateSlug } from "../../../main/infrastructure/utils/generateSlug.ts";
import { uploadImage } from "../../../main/infrastructure/utils/uploadImage.ts";
import { update_vehicle_with_slug_by_user_slug } from "../../application/vehicle/updateVehicleWithSlugByUserSlug.ts";
import { updateImage } from "../../../main/infrastructure/utils/updateImage.ts";
import { UpdateVehicleShema } from "../../../vehicle/domain/schemas/UpdateVehicleShema.ts";
import { removeUndefinedBoby } from "../../../main/infrastructure/utils/removeUndefinedBoby.ts";

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
    const parsered = VehicleSchema.parse(req.body);

    const vehicleData = {
      ...parsered,
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
      const imageUrl = await uploadImage(req, "vehicles/vehicle_photo");

      await userVehicleRepository.update_vehicle_with_slug_by_user_slug(
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

    handleResponse(res, result);
  } catch (error) {
    if ((error as any)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as any).issues,
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

export const updateVehicleWithPlateByUserSlug = async (
  req: Request,
  res: Response,
) => {
  try {
    if (req.body.year) {
      req.body.year = parseInt(req.body.year);
    }

    if (req.body.plate === "null") {
      req.body.plate = null;
    }

    const slug = req.params.slug as string;
    const plate = req.params.plate as string;
    const data = req.body;

    const useCase = update_vehicle_with_plate_by_user_slug(
      userVehicleRepository,
      vehicleRepository,
    );
    const vehicleUpdated = await useCase(slug, plate, data);

    res.status(200).json({
      ok: true,
      data: vehicleUpdated,
      message: "vehicle updated",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const updateVehicleWithSlugByUserSlug = async (
  req: Request,
  res: Response,
) => {
  try {
    if (req.body.year) {
      req.body.year = parseInt(req.body.year);
    }

    if (req.body.plate === "null") {
      req.body.plate = null;
    }

    const slug = req.params.slug as string;
    const vehicle_slug = req.params.vehicle_slug as string;
    let newData = UpdateVehicleShema.parse(req.body);

    newData = removeUndefinedBoby(newData);

    const result = await update_vehicle_with_slug_by_user_slug(
      userVehicleRepository,
      vehicleRepository,
    )(slug, vehicle_slug, newData);

    if (!result.ok) return handleResponse(res, result);

    if (result.ok && req.file) {
      const imageUrl = await updateImage(
        req.file.buffer,
        result.data.public_id_photo,
        "vehicles/vehicle_photo",
      );

      await userVehicleRepository.update_vehicle_with_slug_by_user_slug(
        slug,
        vehicle_slug,
        {
          photo: imageUrl.imageUrl,
          public_id_photo: imageUrl.publicId,
        },
      );

      result.data.photo = imageUrl.imageUrl;
      result.data.public_id_photo = imageUrl.publicId;
    }

    return handleResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};
