import { Response, NextFunction } from "express";
import { TypedRequestBody } from "../../../types/local/expressExtended";
import { StatusCodes } from "http-status-codes";

import { ImageDoc } from "../../../DTO/v1/ImageDoc";
import { ImageDTO } from "../../../types/common/ImageTypes";
import { ImageService } from "../../../services/ImageService";

const FUNCTION_PATH = "v1 image post ";
export async function createImage(
  req: TypedRequestBody<ImageDTO>,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.log.trace(`${FUNCTION_PATH} createImage started`);
  try {
    const Image: ImageDTO = req.body as ImageDTO;
    const response: ImageDoc = await ImageService.create(Image);
    res.status(StatusCodes.OK);
    res.json(response);
  } catch (error: any) {
    req.log.trace(`${FUNCTION_PATH} createImage failed ${error.name} - ${error.message}`);
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} createImage ended`);
}

export async function getImagesByIds(
  req: TypedRequestBody<string[]>,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.log.trace(`${FUNCTION_PATH} getImagesByIds started`);
  try {
    const imageIds: string[] = req.body as string[];
    const response: ImageDoc[] = await ImageService.getImagesFromIds(imageIds);
    res.status(StatusCodes.OK);
    res.json(response);
  } catch (error: any) {
    req.log.trace(`${FUNCTION_PATH} getImagesByIds failed ${error.name} - ${error.message}`);
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} getImagesByIds ended`);
}