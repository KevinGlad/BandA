import mongoose, { Schema, Model, Types } from "mongoose";
import { ImageDocument } from "../../../types/local/ImageModelTypes";

interface ImageModelStaticMethods extends Model<ImageDocument> {
  findImageByName(name: string): Promise<ImageDocument>;
  findImagesByTags(tags: string[]): Promise<ImageDocument[]>;
  findImageByURL(url: string): Promise<ImageDocument>;
  getImageList(): Promise<ImageDocument[]>;
  getUniqueTags(): Promise<string[]>;
  getImagesFromIds(imageIds: string[]): Promise<ImageDocument[]>;
}

const ImageSchema = new Schema<ImageDocument>({
  name: { type: String, required: true, unique: true },
  bImageURL: { type: String, required: true, unique: true },
  aImageURL: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  procedure: { type: String, required: true },
  tags: { type: [String], required: true, index: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

ImageSchema.statics.findImageByName = async function (
  name: string
): Promise<ImageDocument> {
  return await ImageModel.findOne({ name: name });
};

ImageSchema.statics.findImagesByTags = async function (
  tags: string[]
): Promise<ImageDocument[]> {
  return await ImageModel.find({ tags: { $all: tags } });
};

ImageSchema.statics.findImageByURL = async function (
  url: string
): Promise<ImageDocument> {
  return await ImageModel.findOne({
    $or: [{ aImageURL: url }, { bImageURL: url }],
  });
};

ImageSchema.statics.getImageList = async function (): Promise<ImageDocument[]> {
  try {
    const imageList: ImageDocument[] = await ImageModel.find({}).sort({
      name: 1,
    });
    return imageList;
  } catch (error) {
    throw error;
  }
};

ImageSchema.statics.getUniqueTags = async function (): Promise<String[]> {
  try {
    // Fetch all documents (or apply a filter if needed)
    const documents: ImageDocument[] = await ImageModel.find({});

    // Initialize an empty array to store all elements
    let allElements: string[] = [];

    // Iterate through each document and concatenate its dataArray
    documents.forEach((doc) => {
      allElements = allElements.concat(doc.tags);
    });

    // Use a Set to remove duplicate elements
    const uniqueElements = Array.from(new Set(allElements)).sort();

    return uniqueElements;
  } catch (error) {
    throw error; // Re-throw the error for handling in the calling context
  }
};

ImageSchema.statics.getImagesFromIds = async function (
  imageIds: string[]
): Promise<ImageDocument[]> {
    console.log("IMAGES ID",imageIds)
  const objectIds = imageIds.map((id) => new Types.ObjectId(id));
  console.log("IMAGES ID",imageIds)
  // Use the find() method with the $in operator
  const imageDocuments = await ImageModel.find({ _id: { $in: objectIds } });
  return imageDocuments;
};

export const ImageModel = mongoose.model<
  ImageDocument,
  ImageModelStaticMethods
>("Image", ImageSchema);
