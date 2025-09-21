import middlewareLogger from "../../middleware/logging";
import { ReasonPhrases } from "http-status-codes";
import createError from "http-errors";

import { ImageModel } from "../../models/v1/ImageModel";
import { ImageUtils } from "../../utils/ImageUtils";
import { STATIC_FILES_PATH } from "../../constants/serverConstants";

import { ImageDoc } from "../../DTO/v1/ImageDoc";
import { ImageDTO, ImageDocDTO } from "../../types/common/ImageTypes";
import { ImageDocument } from "../../types/local/ImageModelTypes";

const SERVICE = "ImageService";

export default class ImageService {
  static async create(imageDTO: ImageDTO): Promise<ImageDoc> {
    middlewareLogger.logger.info(`${SERVICE} create started`);
    try {
      await Promise.all([
        ImageUtils.downloadImage(imageDTO.bImageURL, STATIC_FILES_PATH),
        ImageUtils.downloadImage(imageDTO.aImageURL, STATIC_FILES_PATH),
      ]);

      const imageDocument: ImageDocument = await ImageModel.create(imageDTO);
      const verifiedImageDocument = await ImageModel.findById(
        imageDocument._id
      );
      middlewareLogger.logger.info(`${SERVICE} create ended`);
      return new ImageDoc(verifiedImageDocument);
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} create failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async updateImage(imageDocDTO: ImageDocDTO): Promise<ImageDoc> {
    middlewareLogger.logger.info(`${SERVICE} updateImage started`);
    try {
      // get original doc
      const orgImageDocument: ImageDocument = await ImageModel.findById(
        imageDocDTO.imageId
      );

      // have the files changed?
      if (orgImageDocument.bImageURL != orgImageDocument.bImageURL) {
        ImageUtils.deleteImage(orgImageDocument.bImageURL, STATIC_FILES_PATH);
        ImageUtils.downloadImage(imageDocDTO.bImageURL, STATIC_FILES_PATH);
      }

      if (orgImageDocument.aImageURL != imageDocDTO.aImageURL) {
        ImageUtils.deleteImage(orgImageDocument.aImageURL, STATIC_FILES_PATH);
        ImageUtils.downloadImage(imageDocDTO.aImageURL, STATIC_FILES_PATH);
      }

      const imageDocument = await ImageModel.findByIdAndUpdate(
        imageDocDTO.imageId,
        imageDocDTO,
        {
          new: true,
        }
      );
      middlewareLogger.logger.info(`${SERVICE} updateImage ended`);
      return new ImageDoc(imageDocument);
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} updateImage failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async findImageById(id: string): Promise<ImageDoc> {
    middlewareLogger.logger.info(`${SERVICE} findImageById started`);
    try {
      const imageDocument: ImageDocument = await ImageModel.findById(id);
      middlewareLogger.logger.info(`${SERVICE} findImageById ended`);
      return new ImageDoc(imageDocument);
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} findImageById failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async findImageByName(name: string): Promise<ImageDoc> {
    middlewareLogger.logger.info(`${SERVICE} findImageById started`);
    try {
      const imageDocument: ImageDocument = await ImageModel.findImageByName(
        name
      );
      middlewareLogger.logger.info(`${SERVICE} findImageById ended`);
      return new ImageDoc(imageDocument);
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} findImageByName failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async findImagesByTags(queryTags: string): Promise<ImageDoc[]> {
    middlewareLogger.logger.info(`${SERVICE} findImagesByTags started`);
    try {
      const tags = queryTags.split(",");
      const imageDocuments: ImageDocument[] = await ImageModel.findImagesByTags(
        tags
      );
      middlewareLogger.logger.info(`${SERVICE} findImagesByTags ended`);
      return imageDocuments.map((document) => new ImageDoc(document));
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} findImagesByTags failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async findImageByURL(url: string): Promise<ImageDoc> {
    middlewareLogger.logger.info(`${SERVICE} findImageByURL started`);
    try {
      const imageDocument: ImageDocument = await ImageModel.findImageByURL(url);
      middlewareLogger.logger.info(`${SERVICE} findImagesByTags ended`);
      return new ImageDoc(imageDocument);
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} findImagesByTags failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async getImageList(): Promise<ImageDoc[]> {
    middlewareLogger.logger.info(`${SERVICE} getImageList started`);
    try {
      const imageDocuments: ImageDocument[] = await ImageModel.getImageList();
      middlewareLogger.logger.info(`${SERVICE} getImageList ended`);
      return imageDocuments.map((document) => new ImageDoc(document));
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} getImageList failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async getImagesFromIds(imageIds: string[]): Promise<ImageDoc[]> {
    middlewareLogger.logger.info(`${SERVICE} getImagesFromIds started`);
    try {
      const imageDocuments: ImageDocument[] = await ImageModel.getImagesFromIds(
        imageIds
      );
      middlewareLogger.logger.info(`${SERVICE} getImagesFromIds ended`);
      return imageDocuments.map((document) => new ImageDoc(document));
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} getImagesFromIds failed with error ${error.message}`
      );
      throw httpError;
    }
  }
  static async getUniqueTags(): Promise<string[]> {
    middlewareLogger.logger.info(`${SERVICE} getUniqueTags started`);
    try {
      const tags: string[] = await ImageModel.getUniqueTags();
      middlewareLogger.logger.info(`${SERVICE} getUniqueTags ended`);
      return tags;
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} getUniqueTags failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async deleteImage(imageId: string): Promise<void> {
    middlewareLogger.logger.info(`${SERVICE} deleteImage started`);

    try {
      // get original doc
      const orgDoc: ImageDTO = await ImageModel.findById(imageId);

      ImageUtils.deleteImage(orgDoc.bImageURL, STATIC_FILES_PATH);
      ImageUtils.deleteImage(orgDoc.aImageURL, STATIC_FILES_PATH);

      await ImageModel.findByIdAndDelete(imageId);
      middlewareLogger.logger.info(`${SERVICE} deleteImage ended`);
      return;
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} deleteImage failed with error ${error.message}`
      );
      throw httpError;
    }
  }
}
