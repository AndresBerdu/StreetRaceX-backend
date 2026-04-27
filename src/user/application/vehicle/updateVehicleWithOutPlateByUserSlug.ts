import type { Vehicle } from "../../../vehicle/domain/interfaces/Vehicle.js"
import type { UserRepository } from "../../domain/interfaces/IUserRepository.js"

export const update_vehicle_withOut_plate_by_user_slug = (userRepository: UserRepository) => {
    return async (slug: string, vehicle_id: string, data: Vehicle) => {
        return  userRepository.update_vehicle_withOut_plate_by_user_slug(slug, vehicle_id, data);
    }
}