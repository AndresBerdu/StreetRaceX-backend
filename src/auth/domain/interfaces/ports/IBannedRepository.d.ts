export interface IBannedRepository {
  is_token_banned(refreshToken: string): Promise<string | null>;
  logue_out_session(accessToken: string, refreshToken: string): Promise<void>;
}
