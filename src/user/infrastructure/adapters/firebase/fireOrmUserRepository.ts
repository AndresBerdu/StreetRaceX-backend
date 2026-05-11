import { getRepository } from "fireorm";
import { UserModel } from "./UserModel.ts";
import { v4 as uuidv4 } from "uuid";
import { VehicleModel } from "../../../../vehicle/infrastructure/adapters/firebase/VehicleModel.ts";
import type { IUserRepository } from "../../../domain/interfaces/ports/IUserRepository.js";

const userFireRepository = getRepository(UserModel);
const vehicleFireRepository = getRepository(VehicleModel);

export const fireOrmUserRepository = (): IUserRepository =>
  /* FUNCTIONS WITHOUT PARM */

  ({
    async count_users() {
      const users = await userFireRepository.find();
      return users.length;
    },

    async get_user_by_username(username) {
      return await userFireRepository
        .whereEqualTo("username", username)
        .findOne();
    },

    async get_user_by_email(email) {
      return await userFireRepository.whereEqualTo("email", email).findOne();
    },

    async get_users(page, size) {
      const skip = (page - 1) * size;

      const users = await userFireRepository
        .orderByAscending("created_at")
        .limit(skip + size)
        .find();

      return users.slice(skip, skip + size);
    },

    async create_user(user) {
      const userModel = new UserModel();

      Object.assign(userModel, user);

      userModel.id = uuidv4();

      return await userFireRepository.create(userModel);
    },

    /* FUNCTIONS WITH USER SLUG */

    async get_user_by_id(id) {
      return userFireRepository.findById(id);
    },

    async get_user_by_slug(slug) {
      const user = await userFireRepository
        .whereEqualTo("slug", slug)
        .findOne();

      return user!;
    },

    async update_user_by_slug(slug, data) {
      const user = await userFireRepository
        .whereEqualTo("slug", slug)
        .findOne();

      const { locality, ...rest } = data;

      Object.assign(user!, rest);

      if (locality) {
        user!.locality = {
          ...user!.locality,
          ...locality,
        };
      }

      user!.updated_at = new Date();

      return await userFireRepository.update(user!);
    },

    async delete_user_by_slug(slug) {
      const user = await userFireRepository
        .whereEqualTo("slug", slug)
        .findOne();

      return await userFireRepository.delete(user?.id!);
    },

    async get_vehicles_by_user_slug(slug) {
      const user = await this.get_user_by_slug(slug);

      const vehicles = await vehicleFireRepository
        .whereEqualTo("user_id", user?.id!)
        .find();
      return vehicles;
    },

    async create_vehicle_by_user_slug(_slug, vehicle) {
      const vehicleModel = new VehicleModel();

      Object.assign(vehicleModel, vehicle);

      vehicleModel.id = uuidv4();

      return await vehicleFireRepository.create(vehicleModel);
    },

    async update_vehicle_by_vehicle_slug_by_user_slug(_slug, vehicle_slug, data) {
      const vehicle = await vehicleFireRepository
        .whereEqualTo("slug", vehicle_slug)
        .findOne();

      Object.assign(vehicle!, data);

      if (data.active !== undefined) {
        vehicle!.active = data.active;
      }

      return await vehicleFireRepository.update(vehicle!);
    },

    async delete_vehicle_by_vehicle_slug_by_user_slug(_slug, vehicle_slug) {
      const vehicle = await vehicleFireRepository
        .whereEqualTo("slug", vehicle_slug)
        .findOne();

      return await vehicleFireRepository.delete(vehicle?.id!);
    },
  });
