import { Collection } from "fireorm";

@Collection("Message")
export class MessageModel {
  id!: string;
  user_id!: string;
  type!: string;
  message!: string;
  road!: boolean;
  reference_id!: string;
  created_at!: string;
}
