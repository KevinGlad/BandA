const path = require('path')
import express, { Express, Request, Response, NextFunction } from "express"
import helmet from "helmet"
import cors from "cors"

import createError from "http-errors"
// import swaggerUI from 'swagger-ui-express'
import cookieParser from 'cookie-parser'

import middlewareLogger from "./middleware/logging"
import errorHandlers from "./middleware/errorHandlers"

/**
 * Import routers
 */
import healthCheckRouter from "./routes/v1/healthCheck/healthCheck"
import imageRouter from "./routes/v1/image"
import favoriteRouter from "./routes/v1/favorite"

// import systemsRouter from './routes/v2/systems'


/**
 * Setup Swagger
 */
// import swaggerDocs from './swaggerDocs'

/**
 * Setup Passport
 */
// import {
//   passportConfigure,
//   passportAuthenticate,
// } from './middleware/authentication/passport-config'
// import { initializeAuthenticationAllowListMap } from './middleware/authentication/validateEndpointAuthStrategy'

// initialize passport
// must be called BEFORE passport authenticate
// passportConfigure()

// // must be called at build time for validateRequestAuthStrategy to function during runtime
// initializeAuthenticationAllowListMap()

/**
 * Creates an Express instance and attaches app middleware and routes.
 */
export default class BandAServer {
  app: Express
  constructor() {
    // Create Express App
    this.app = express()

    // Attach Middleware
    this.middleware()

    // non authenticated routes
    this.nonAuthenticatedRoutes()

    // Note: all routes after this point will require authentication including 404 Not Found

    // passport authentication.
    // passportConfigure must be called BEFORE implementing this middleware
    // this.app.use(passportAuthenticate)

    // Attach App related routes
    this.authenticatedRoutes()

    // error handling - must be last
    this.errors()
  }

    /**
     * Server Middleware -- business logic
     */
    middleware() {
    // application level middleware

    // middleware is executed in order of being added.

    // Basic Web Security
    // (https://helmetjs.github.io/docs/)
    this.app.use(helmet())
    this.app.use(cors({
          origin: "http://localhost:5173" // Or an array of allowed origins
        }))

    // Logger middleware
    this.app.use(middlewareLogger)

    this.app.use(express.json({ limit: '5mb' })) // json parser
    // this.app.use(cookieParser()) // http://expressjs.com/en/resources/middleware/cookie-parser.html
    // this.app.use(express.urlencoded({ extended: false })) // url encoded parser
  }

  nonAuthenticatedRoutes() {
    // Add health check end point
    this.app.use("/info", healthCheckRouter)
    this.app.use("/image", imageRouter)
    this.app.use("/favorite", favoriteRouter)
    this.app.use('/static', express.static("C:\\Users\\kevin\\Documents\\Gentle Revive\\Images"))

    // OpenAPI Live Documentation
    // Implemented according to https://github.com/scottie1984/swagger-ui-express#load-swagger-from-url
    // under heading "Two Swagger Documents"
    // to implement a drop down in the Explorer bar that allows the version to be selected from a common endpoint
    // First create get endpoints for each version that returns the swagger object as json
    // set the explorer option in swaggerUI.setup options to true
    // use the urls option in swaggerUI.setup options to list the endpoints and swagger will provide the dropdown.
    // see the swagger-ui-express and swagger-ui docs for more info.
    // the second param in the setup function is the options object.
    // this.app.use(
    //   '/api-docs',
    //   swaggerUI.serveFiles(swaggerDocs),
    //   swaggerUI.setup(swaggerDocs, { customSiteTitle: 'Adobe Blueprints Catalog API' })
    // )
  }

  authenticatedRoutes() {
    // Add routes which needs authentication and authorization to access
    //this.app.use(`${BASE_PATH}/systems`, systemsRouter)

  }

  errors() {
    // catch all route handler
    function notFound(request: Request, response: Response, next: NextFunction): any {
      next(new createError.NotFound())
    }

    // use not found route
    this.app.use(notFound)

    // must be added last
    this.app.use(errorHandlers)
  }
}
