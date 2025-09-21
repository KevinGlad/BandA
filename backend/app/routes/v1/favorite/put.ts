import { Response, NextFunction } from "express";
import { TypedRequestBody } from "../../../types/local/expressExtended";
import { StatusCodes } from "http-status-codes";

import { FavoriteDoc } from "../../../DTO/v1/FavoriteDoc";
import { FavoriteService } from "../../../services/FavoriteService";

import type { FavoriteDocDTO } from "../../../types/common/FavoriteTypes";
const FUNCTION_PATH = "favorite v1 put";
export async function updateFavorite(
  req: TypedRequestBody<FavoriteDocDTO>,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.log.trace(`${FUNCTION_PATH} updateFavorite started`);
  try {
    const favoriteDoc: FavoriteDocDTO = req.body;
    console.log("FAVEUP",favoriteDoc)
    const response: FavoriteDoc = await FavoriteService.updateFavorite(favoriteDoc)
    res.status(StatusCodes.OK);
    res.json(response);
  } catch (error: any) {
    req.log.trace(`${FUNCTION_PATH} updateFavorite failed ${error.name} - ${error.message}`);
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} updateFavorite ended`);
}
