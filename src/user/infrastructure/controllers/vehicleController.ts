import type { Request, Response } from "express";
import { create_vehicle_by_user_slug } from "../../application/vehicle/createVehicleByUserSlug.ts";
import { VehicleSchema } from "../../../vehicle/domain/schemas/VehicleShema.ts";
import { fireOrmVehicleRepository } from "../../../vehicle/infrastructure/firebase/fireOrmVehicleRepository.ts";
import { get_vehicles_by_user_slug } from "../../application/vehicle/getVehiclesByUserSlug.ts";
import { update_vehicle_with_plate_by_user_slug } from "../../application/vehicle/updateVehicleWithPlateByUserSlug.ts";
import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";
import { generateSlug } from "../../../main/infrastructure/utils/generateSlug.ts";
import { updateImage } from "../../../main/infrastructure/utils/updateImage.ts";
import { UpdateVehicleShema } from "../../../vehicle/domain/schemas/UpdateVehicleShema.ts";
import { removeUndefinedBoby } from "../../../main/infrastructure/utils/removeUndefinedBoby.ts";
import { delete_vehicle_with_plate_by_user_slug } from "../../application/vehicle/deleteVehicleWithPlateByUserSlug.ts";
import type { ZodError } from "zod/v4";
import { fireOrmUserRepository } from "../adapters/firebase/fireOrmUserRepository.ts";

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

    handleResponse(res, result);
  } catch (error) {
    if ((error as ZodError)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as ZodError).issues.map((issue) => {
          return issue.message;
        }),
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
    let newData = UpdateVehicleShema.parse(req.body);

    newData = removeUndefinedBoby(newData);

    const result = await update_vehicle_with_plate_by_user_slug(
      userVehicleRepository,
      vehicleRepository,
    )(slug, plate, newData);

    handleResponse(res, result);
  } catch (error) {
    if ((error as ZodError)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as ZodError).issues.map((issue) => {
          return issue.message;
        }),
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

export const deleteVehicleWithPlateByUserSlug = async (
  req: Request,
  res: Response,
) => {
  try {
    const slug = req.params.slug as string;
    const plate = req.params.plate as string;

    const result = await delete_vehicle_with_plate_by_user_slug(
      userVehicleRepository,
      vehicleRepository,
    )(slug, plate);

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

export const updateVehiclePhoto = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const vehicle_slug = req.params.vehicle_slug as string;

    if (!req.file) {
      return res
        .status(400)
        .json({ ok: false, error: "Vehicle photo is required" });
    }

    const user = await userVehicleRepository.get_user_by_slug(slug);

    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    const vehicle = await vehicleRepository.get_vehicle_by_slug(vehicle_slug);

    if (!vehicle) {
      return res.status(404).json({ ok: false, error: "Vehicle not found" });
    }

    const imageUrl = await updateImage(
      req.file.buffer,
      vehicle.public_id_photo,
      "vehicles/vehicle_photo",
    );

/*     await userVehicleRepository.update_vehicle_with_slug_by_user_slug(
      user.slug,
      vehicle.slug,
      {
        photo: imageUrl?.imageUrl,
        public_id_photo: imageUrl?.publicId,
      },
    );

    vehicle.photo = imageUrl.imageUrl;
    vehicle.public_id_photo = imageUrl.publicId;

    return res.status(200).json({
      ok: true,
      data: { profile_photo: imageUrl?.imageUrl },
      message: "Vehicle photo updated",
    }) */;
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  }
};
