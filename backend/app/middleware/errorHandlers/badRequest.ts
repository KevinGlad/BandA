import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { validationResult, FieldValidationError } from "express-validator";
import { ImageErrorDTO,FIELD_ERROR_IDENTIFIER } from "../../types/common/ImageTypes"

function badRequestHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.log.trace("badRequestHandler started");
  if (error.statusCode === StatusCodes.BAD_REQUEST) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorArray = errors.array();

      // Check for the specific error type with a `path` property
      const fieldErrors = errorArray.filter(
        (err): err is FieldValidationError => err.type === "field"
      );

      const errorObject = fieldErrors.reduce(
        (errObj: ImageErrorDTO, error) => {
          console.log(errObj)
          errObj[FIELD_ERROR_IDENTIFIER][error.path] = error.msg

          return errObj
        },
        { [FIELD_ERROR_IDENTIFIER]: {} } as any
      );

      req.log.warn(
        `Request received with following errors: ${JSON.stringify(errorObject)}`
      );

      req.log.trace("badRequestHandler ended");
      res.status(error.statusCode);
      res.json(errorObject);
    }
    // else bad request error not from express validator let default handler log it
    
  } else {
    req.log.trace("badRequestHandler ended -- calling next(error)");
    next(error);
  }
}

export default badRequestHandler;
