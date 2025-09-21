import { Types } from "mongoose";

export interface FavoriteDocument {
  _id: Types.ObjectId;
  name: string;
  provider: string;
  bAndaPicIds: Types.ObjectId[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
