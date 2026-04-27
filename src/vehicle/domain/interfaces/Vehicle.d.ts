export type Vehicle = {
  id?: string;
  user_id?: string;
  vehicle_type: vehicle_type;
  brand: string;
  model: string;
  year: number;
  color: string;
  plate: string | null;
  photo: string;
  modifications: string;
  active?: boolean;
  created_at?: Date;
};

export type vehicle_type = "car" | "motorcycle" | "skate_board";
