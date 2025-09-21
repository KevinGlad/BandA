import {  Response, NextFunction } from "express";
import { TypedRequestBody } from "../../../types/local/expressExtended";
import { StatusCodes } from "http-status-codes";
import { FavoriteDoc } from "../../../DTO/v1/FavoriteDoc";
import { FavoriteDTO } from "../../../types/common/FavoriteTypes";
import { FavoriteService } from "../../../services/FavoriteService";

const FUNCTION_PATH = "v1 favorite post";

export async function createFavorite(
  req: TypedRequestBody<FavoriteDTO>,
  res: Response,
  next: NextFunction
) {
  req.log.trace(`${FUNCTION_PATH} createFavorite started`);
  try {
    const favoriteDTO: FavoriteDTO = req.body as FavoriteDTO;
    const response: FavoriteDoc = await FavoriteService.create(favoriteDTO);
    res.status(StatusCodes.OK);
    res.json(response);
  } catch (error) {
    req.log.error(
      `${FUNCTION_PATH} createFavorite failed ${error.name} - ${error.message}`
    );
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} createFavorite started`);
}
