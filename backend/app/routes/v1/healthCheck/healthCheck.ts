import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { VERSION } from "../../../constants/serverConstants"
import middlewareLogger from "../../../middleware/logging"

const router = express.Router()

/**
 * Simple health check that always returns "200". Required for k8s.
 */
export function healthCheck(_: Request, res: Response) {
  middlewareLogger.logger.trace('get /info starting')
  res.status(StatusCodes.OK)
  res.json({
    status: 'OK',
    version: VERSION,
  })
  middlewareLogger.logger.trace('get /info ended')
}

router.get('/', healthCheck)

export default router
