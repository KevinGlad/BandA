import { Image } from "openai/resources/images";

export interface ImageDTO {
  name: string;
  bImageURL: string;
  aImageURL: string;
  clientId: string;
  procedure: string;
  tags: string[];
}

export interface ImageDocDTO extends ImageDTO {
  imageId: string;
}

export interface cacheDTO {
  ImageURL: string;
  ImageLocation: string;
  ImageFilename: string;
  ImagePreviewLocation: string;
  ImagePreviewFilename: string;
}

export const FIELD_ERROR_IDENTIFIER = "fieldValidationErrors";
export interface ImageErrorDTO {
  FIELD_ERROR_IDENTIFIER: object;
}
