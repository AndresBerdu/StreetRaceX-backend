import type { User } from "./User.js";

export interface UserRepository {
  count_users(): Promise<number>
  get_users(page: number, size: number): Promise<User[] | null>;
  get_user_by_id(id: string): Promise<User | null>;
  get_user_by_username(username: string): Promise<User | null>;
  create_user(user: User): Promise<User>;
  update_user_by_id(id: string, data: User): Promise<User>;
  update_user_by_username(username: string): Promise<user>;
  delete_user_by_id(id: string): void;
  delete_user_by_username(username: string): void;
}
