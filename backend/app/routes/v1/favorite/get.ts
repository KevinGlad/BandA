import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { FavoriteDoc } from "../../../DTO/v1/FavoriteDoc";
import { FavoriteService as FavoriteService } from "../../../services/FavoriteService";

const FUNCTION_PATH = "v1 favorite get";

export async function getFavorites(
  req: Request<{ provider: string }>,
  res: Response,
  next: NextFunction
) {
  req.log.trace(`${FUNCTION_PATH} getFavorites started`);
  try {
    const favoriteList: FavoriteDoc[] = await FavoriteService.getFavorites();
    res.status(StatusCodes.OK);
    res.json(favoriteList);
  } catch (error) {
    req.log.error(
      `${FUNCTION_PATH} getFavorites failed ${error.name} - ${error.message}`
    );
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} getFavorites ended`);
}

export async function getFavoriteById(
  req: Request<{ favoriteId: string }>,
  res: Response,
  next: NextFunction
) {
  req.log.trace(`${FUNCTION_PATH} getFavoriteById started`);
  try {
    const favoriteId: string = decodeURIComponent(req.params.favoriteId as string);
    const favorite: FavoriteDoc = await FavoriteService.findFavoriteById(favoriteId);
    res.status(StatusCodes.OK);
    res.json(favorite);
  } catch (error) {
    req.log.error(
      `${FUNCTION_PATH} getFavoriteById failed ${error.name} - ${error.message}`
    );
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} getFavoriteById ended`);
}

export async function getFavoritesByProvider(
  req: Request<{ provider: string }>,
  res: Response,
  next: NextFunction
) {
  req.log.trace(`${FUNCTION_PATH} getFavoritesByProvider started`);
  try {
    const provider: string = decodeURIComponent(req.params.provider as string);
    const favoriteList: FavoriteDoc[] =
      await FavoriteService.getFavoritesByProvider(provider);
    res.status(StatusCodes.OK);
    res.json(favoriteList);
  } catch (error) {
    req.log.error(
      `${FUNCTION_PATH} getFavoritesByProvider failed ${error.name} - ${error.message}`
    );
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} getFavoritesByProvider ended`);
}

export async function getFavoriteByName(
  req: Request<{ name: string }>,
  res: Response,
  next: NextFunction
) {
  req.log.trace(`${FUNCTION_PATH} getFavoriteByName started`);
  try {
    const name: string = decodeURIComponent(req.params.name as string);
    const favorite: FavoriteDoc = await FavoriteService.findFavoriteByName(name);
    res.status(StatusCodes.OK);
    res.json(favorite);
  } catch (error) {
    req.log.error(
      `${FUNCTION_PATH} getFavoriteByName failed ${error.name} - ${error.message}`
    );
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} getFavoriteByName ended`);
}
