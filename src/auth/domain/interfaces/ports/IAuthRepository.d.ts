import type { User } from "../../../../user/domain/interfaces/User.js";
import type { BannedTokensModel } from "../../../infrastructure/firebase/AuthModel.ts";
import type { Token } from "../Token.js";
import type { UserCredentials } from "../UserCrendentials.js";

export interface IAuthRepository {
  sign_up_session(user: User): Promise<User>;
  sign_in_session(userCredentials: UserCredentials): Promise<User>;
}
