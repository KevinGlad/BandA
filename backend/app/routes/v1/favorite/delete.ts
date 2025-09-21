import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { FavoriteService } from "../../../services/FavoriteService";

const FUNCTION_PATH = "v1 favorite delete";
export async function deleteFavorite(
  req: Request <{ favoriteId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.log.trace(`${FUNCTION_PATH} deleteFavorite started`);
  try {
    const favoriteId: string = decodeURIComponent(req.params.favoriteId as string);
    await FavoriteService.deleteFavorite(favoriteId);
    res.status(StatusCodes.OK);
    res.send()
  } catch (error: any) {
    req.log.trace(`${FUNCTION_PATH} deleteFavorite failed ${error.name} - ${error.message}`);
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} deleteFavorite ended`);
}

