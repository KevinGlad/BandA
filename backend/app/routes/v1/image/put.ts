import { Response, NextFunction } from "express";
import { TypedRequestBody } from "../../../types/local/expressExtended";
import { StatusCodes } from "http-status-codes";

import { ImageDoc } from "../../../DTO/v1/ImageDoc";
import { ImageService } from "../../../services/ImageService";

import type { ImageDocDTO } from "../../../types/common/ImageTypes";

const FUNCTION_PATH = "v1 image put";
export async function updateImage(
  req: TypedRequestBody<ImageDocDTO>,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.log.trace(`${FUNCTION_PATH} updateImage started`);
  try {
    const ImageDocDTO: ImageDocDTO = req.body;
    const response: ImageDoc = await ImageService.updateImage(ImageDocDTO);
    res.status(StatusCodes.OK);
    res.json(response);
  } catch (error: any) {
    req.log.trace(`${FUNCTION_PATH} updateImage failed ${error.name} - ${error.message}`);
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} updateImage ended`);
}
