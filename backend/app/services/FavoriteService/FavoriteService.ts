import middlewareLogger from "../../middleware/logging";
import { ReasonPhrases } from "http-status-codes";
import createError from "http-errors";

import { FavoriteModel } from "../../models/v1/FavoriteModel";
import { FavoriteDTO, FavoriteDocDTO } from "../../types/common/FavoriteTypes";
import { FavoriteDoc } from "../../DTO/v1/FavoriteDoc";
import { FavoriteDocument } from "../../types/local/FavoriteModelTypes";

const SERVICE = "FavoriteService";
export default class FavoriteService {
  static async create(favoriteDTO: FavoriteDTO): Promise<FavoriteDoc> {
    middlewareLogger.logger.info(`${SERVICE} create started`);
    try {
      const favoriteDocument: FavoriteDocument = await FavoriteModel.create(
        favoriteDTO
      );
      const verifyFavoriteDocument = await FavoriteModel.findById(
        favoriteDocument._id
      );
      middlewareLogger.logger.info(`${SERVICE} create ended`);
      return new FavoriteDoc(verifyFavoriteDocument);
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

  static async getFavorites(): Promise<FavoriteDoc[]> {
    middlewareLogger.logger.info(`${SERVICE} getFavorites started`);
    try {
      const favoriteDocuments: FavoriteDocument[] =
        await FavoriteModel.getFavorites();
      middlewareLogger.logger.info(`${SERVICE} getFavorites ended`);
      return favoriteDocuments.map((document) => new FavoriteDoc(document));
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} getFavorites failed with error ${error.message}`
      );
      throw httpError;
    }
  }
  static async findFavoriteById(favoriteId: string): Promise<FavoriteDoc> {
    middlewareLogger.logger.info(`${SERVICE} findFavoriteById started`);
    try {
      const favoriteDocument: FavoriteDocument = await FavoriteModel.findById(
        favoriteId
      );
      middlewareLogger.logger.info(`${SERVICE} findFavoriteById ended`);
      return new FavoriteDoc(favoriteDocument);
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} findFavoriteById failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async getFavoritesByProvider(
    provider: string
  ): Promise<FavoriteDoc[]> {
    middlewareLogger.logger.info(`${SERVICE} getFavoritesByProvider started`);
    try {
      const favoritesList: FavoriteDocument[] =
        await FavoriteModel.getFavoritesByProvider(provider);
      middlewareLogger.logger.info(`${SERVICE} getFavoritesByProvider ended`);
      return favoritesList.map((document) => new FavoriteDoc(document));
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} getFavoritesByProvider failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async findFavoriteByName(name: string): Promise<FavoriteDoc> {
    middlewareLogger.logger.info(`${SERVICE} findFavoriteByName started`);
    try {
      const favorite: FavoriteDocument = await FavoriteModel.getFavoriteByName(
        name
      );
      middlewareLogger.logger.info(`${SERVICE} findFavoriteByName ended`);
      return new FavoriteDoc(favorite);
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} findFavoriteByName failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async updateFavorite(
    favoriteDTODoc: FavoriteDocDTO
  ): Promise<FavoriteDoc> {
    middlewareLogger.logger.info(`${SERVICE} updateFavorite started`);
    try {
      const favoriteDocument = await FavoriteModel.findByIdAndUpdate(
        favoriteDTODoc.favoriteId,
        favoriteDTODoc,
        {
          new: true,
        }
      );
      middlewareLogger.logger.info(`${SERVICE} updateFavorite ended`);
      return new FavoriteDoc(favoriteDocument);
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} updateFavorite failed with error ${error.message}`
      );
      throw httpError;
    }
  }

  static async deleteFavorite(favoriteId: string): Promise<void> {
    middlewareLogger.logger.info(`${SERVICE} deleteFavorite started`);

    try {
      // get original doc
      const orgDoc: FavoriteDTO = await FavoriteModel.findById(favoriteId);

      await FavoriteModel.findByIdAndDelete(favoriteId);
      middlewareLogger.logger.info(`${SERVICE} deleteFavorite ended`);
      return;
    } catch (error) {
      const httpError = createError.InternalServerError(
        `${ReasonPhrases.INTERNAL_SERVER_ERROR} in ${SERVICE} caused by ${error.message}`
      );
      middlewareLogger.logger.error(
        `${SERVICE} deleteFavorite failed with error ${error.message}`
      );
      throw httpError;
    }
  }
}
