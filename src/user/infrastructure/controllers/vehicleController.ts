import type { Request, Response } from "express";
import { fireoUserRepository } from "../firebase/fireOrmUserRepository.ts";
import { create_vehicle_by_user_id } from "../../application/vehicle/createVehicleByUserSlug.ts";
import { VehicleSchema } from "../../../vehicle/domain/schemas/VehicleShema.ts";
import { ZodError } from "zod/v4";

import { fireOrmVehicleRepository } from "../../../vehicle/infrastructure/firebase/fireOrmVehicleRepository.ts";
import { get_vehicles_by_user_slug } from "../../application/vehicle/getVehiclesByUserSlug.ts";
import { update_vehicle_with_plate_by_user_slug } from "../../application/vehicle/updateVehicleWithPlateByUserSlug.ts";
import { update_vehicle_withOut_plate_by_user_slug } from "../../application/vehicle/updateVehicleWithOutPlateByUserSlug.ts";

const userVehicleRepository = fireoUserRepository();
const vehicleRepository = fireOrmVehicleRepository();

export const getVehiclesByUserSlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    const useCase = get_vehicles_by_user_slug(userVehicleRepository);
    const vehicles = await useCase(slug);

    return res.status(200).json({
      ok: true,
      data: vehicles,
      message: "cars obteinded",
    });
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
    const slug = req.params.slug as string;
    const parsered = VehicleSchema.parse(req.body);

    const vehicleData = {
      ...parsered,
      created_at: new Date(),
    };

    const useCase = create_vehicle_by_user_id(
      userVehicleRepository,
      vehicleRepository,
    );

    const newVehicle = await useCase(slug, vehicleData);

    return res.status(201).json({
      ok: true,
      data: newVehicle,
      message: "vehicle created",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(409).json({
        ok: false,
        error: error.issues,
      });
    }

    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUNDED") {
        return res.status(404).json({
          ok: false,
          error: "user not founded",
        });
      }

      if (error.message === "THIS_VEHICLE_IS_ALREADY_REGISTERED") {
        return res.status(400).json({
          ok: false,
          error: "this vehicle is already registered",
        });
      }

      if (error.message === "ONLY_3_VEHICLES_PER_USER") {
        return res.status(409).json({
          ok: false,
          error: "only 3 vehicles per user",
        });
      }

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
      if (error.message === "USER_NOT_FOUND") {
        res.status(404).json({
          ok: false,
          error: "user not found",
        });
      }

      if (error.message === "VEHICLE_NOT_FOUND") {
        res.status(404).json({
          ok: false,
          error: "vehicle not found",
        });
      }
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const updateVehicleWithOutPlateByUserSlug = async (
  req: Request,
  res: Response,
) => {
  try {
    const slug = req.params.slug as string;
    const vehicle_id = req.params.vehicle_id as string;
    const data = req.body

    const useCase = update_vehicle_withOut_plate_by_user_slug(userVehicleRepository);
    const vehicle = await useCase(slug, vehicle_id, data);

    return res.status(200).json({
      ok: true,
      data: vehicle,
      message: "Vehicle update"
    })

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};
