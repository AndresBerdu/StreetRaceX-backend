export interface AuthRepository {
  sign_up_session(user: User): Promise<User>;
  sign_in_session(): Promise<void>;
  logue_out_session(): Promise<void>;
  refresh_session(): Promise<void>;
}
