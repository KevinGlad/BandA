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

// export interface ImageListItem {
//   _id: string;
//   name: string;
//   procedure: string;
//   bImageURL: string;
//   aImageURL: string;
// }

// export type ImageList = ImageListItem[];
export interface cacheDTO {
  imageURL: string;
  imageLocation: string;
  imageFilename: string;
  imagePreviewLocation: string;
  imagePreviewFilename: string;
}


export const FIELD_ERROR_IDENTIFIER = "fieldValidationErrors";

export interface ImageErrorDTODef {
  FIELD_ERROR_IDENTIFIER: object;
}
