import { Types } from "mongoose";

export interface ImageDocument {
  _id: Types.ObjectId;
  name: string;
  bImageURL: string;
  aImageURL: string;
  clientId: string;
  procedure: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
