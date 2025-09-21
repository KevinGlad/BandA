import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

// all other errors not previously handled
// NOTE: Express recognizes this as an error handler by the four argument signature.
// Dropping an argument, even an un-used argument causes issues with express.
function defaultHandler(
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  req.log.trace(`Default Error Handler Started`);

  // Only errors created by http-errors will have a status code
  let { statusCode } = error;

  if (statusCode === undefined) {
    req.log.error("statusCode is undefined");
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  // log the error as a 500
  req.log.error(error);

  req.log.trace(
    "defaultHandler ended -- this is the end of the line as far as we go"
  );
  // send the statusCode and message to the client
  res.status(statusCode);
  res.json({ status: statusCode, message: error.message });
}

export default defaultHandler;
