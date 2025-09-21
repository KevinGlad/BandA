import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ImageService } from "../../../services/ImageService";
import { ImageDoc } from "../../../DTO/v1/ImageDoc";

const FUNCTION_PATH = "v1 image get";

export async function getImageList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  req.log.trace(`${FUNCTION_PATH} getImageList started`);
  try {
    const response: ImageDoc[] = await ImageService.getImageList();
    res.status(StatusCodes.OK);
    res.json(response);
  } catch (error) {
    req.log.error(
      `${FUNCTION_PATH} getImageList failed ${error.name} - ${error.message}`
    );
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} getImageList ended`);
}
export async function getImagesByTags(
  req: Request<{ tags: string }>,
  res: Response
) {
  req.log.trace("getImagesByTags");
  const queryTags: string = decodeURIComponent(req.query.tags as string);
  const imageList: ImageDoc[] = await ImageService.findImagesByTags(
    queryTags
  );
  res.status(StatusCodes.OK);
  res.json(imageList);
}

export async function getImageById(
  req: Request<{ imageId: string }>,
  res: Response,
  next: NextFunction
) {
  req.log.trace(`${FUNCTION_PATH} getImageById started`);
  try {
    const queryId: string = decodeURIComponent(req.params.imageId as string);
    const imageDoc: ImageDoc = await ImageService.findImageById(queryId);
    res.status(StatusCodes.OK);
    res.json(imageDoc);
  } catch (error) {
    req.log.error(
      `${FUNCTION_PATH} getImageById failed ${error.name} - ${error.message}`
    );
    next(error);
  }
  req.log.trace(`${FUNCTION_PATH} getImageById ended`);
}

export async function getImageByURL(
  req: Request<{ url: string }>,
  res: Response
) {
  req.log.trace("getImageByURL");
  const queryURL: string = decodeURIComponent(req.query.url as string);
  const imageDoc: ImageDoc = await ImageService.findImageByURL(queryURL);
  res.status(StatusCodes.OK);
  res.json(imageDoc);
}

export async function getUniqueTags(req: Request, res: Response) {
  req.log.trace("getUniqueTags");
  try {
    const tagList: string[] = await ImageService.getUniqueTags();
    res.status(StatusCodes.OK);
    res.json(tagList);
  } catch (error) {}
}
