export enum VehicleType {
  CAR = "car",
  MOTORCYCLE = "motorcycle",
  SKATE_BOARD = "skate_board",
}

export type Vehicle = {
  id?: string;
  user_id?: string;
  slug: string;
  vehicle_type: VehicleType;
  brand: string;
  model: string;
  year: number;
  color: string;
  plate: string | null;
  photo: string | null;
  public_id_photo: string | null;
  modifications?: string | null;
  active?: boolean;
  created_at: Date;
};

