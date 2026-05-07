import type { Vehicle } from "../../../vehicle/domain/interfaces/Vehicle.js";
import type { User } from "./User.js";

export interface IUserRepository {
  //auxiliar functions
  count_users(): Promise<number>;
  get_user_by_username(username: string): Promise<User | null>;
  get_user_by_email(email: string): Promise<User | null>;
  get_user_by_id(id: string): Promise<User | null>;

  //User functions
  get_users(page: number, size: number): Promise<User[] | null>;
  create_user(user: User): Promise<User>;
  get_user_by_slug(slug: string): Promise<User>;
  update_user_by_slug(slug: string, data: Partial<User>): Promise<User>;
  delete_user_by_slug(slug: string): void;

  //Vehicle functions
  get_vehicles_by_user_slug(slug: string): Promise<Vehicle[]>;
  create_vehicle_by_user_slug(slug: string, vehicle: Vehicle): Promise<Vehicle>;
  update_vehicle_with_plate_by_user_slug(
    slug: string,
    plate: string,
    data: Vehicle,
  ): Promise<Vehicle>;
  update_vehicle_with_slug_by_user_slug(
    slug: string,
    vehicle_id: string,
    data: Vehicle,
  );
  delete_vehicle_with_plate_by_user_slug(slug: string, plate: string): void;
  delete_vehicle_with_slug_by_user_slug(
    slug: string,
    vehicle_slug: string,
  ): void;
}
