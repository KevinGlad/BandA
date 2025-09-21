import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { ImageService } from "../../../services/ImageService";

const FUNCTION_PATH = "v1 image delete";
export async function deleteImage(
  req: Request <{ imageId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.log.trace(`${FUNCTION_PATH} deleteImage started`);
  try {
    const imageId: string = decodeURIComponent(req.params.imageId as string);
    await ImageService.deleteImage(imageId);
    res.status(StatusCodes.OK);
    res.send()
  } catch (error: any) {
    req.log.trace(`${FUNCTION_PATH} deleteImage failed ${error.name} - ${error.message}`);
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} deleteImage ended`);
}

