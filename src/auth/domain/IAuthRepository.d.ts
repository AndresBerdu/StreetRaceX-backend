import type { User } from "../../user/domain/interfaces/User.js";
import type { UserCredentials } from "./interfaces/UserCrendentials.js";

export interface AuthRepository {
  sign_up_session(user: User): Promise<User>;
  sign_in_session(userCredentials: UserCredentials): Promise<User | null>;
}
