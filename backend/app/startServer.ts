import http from 'http'
import { Express } from 'express'
import { IS_DEV } from "./constants/serverConstants"
import { SERVER_BASE_URL, SERVER_PORT } from "./constants/serverConstants"
import middlewareLogger from "./middleware/logging"

const env = IS_DEV ? 'Development' : 'Production'

/**
 * Starts App Server on port.
 * Returns server if successful
 */
export default function startServer(app: Express, port = SERVER_PORT) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app)

    // @ts-ignore
    server.listen(port, '0.0.0.0', (err) => {
        if (err) {
            middlewareLogger.logger.fatal('Error starting server', err)
            reject(err)
            return
        }
    middlewareLogger.logger.info(`Server up at ${SERVER_BASE_URL}:${port} \nServer is running in "${env}" mode.`)
    resolve(server)
    })
    server.on('error', reject)
  })
}
