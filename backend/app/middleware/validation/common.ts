// schemas that are common to all endpoints
/*

  This file hold validation error handling that are common to multiple endpoints

  Using these middleware functions prevents having to write an error handler in
  each endpoint function.

*/

// Object of Schema Validation Objects as defined by express-validator
// https://express-validator.github.io/docs/schema-validation.html

import { CustomValidator, Schema, validationResult } from 'express-validator'

import { Request, Response, NextFunction } from 'express'

const createError = require('http-errors')

// function to check to see if at least one key
// from a list of keys is on the body.
// oneOf in express validator does not work in schema validations
export function oneOfInBody(req: Request, allowedKeys: Array<string>): Promise<boolean> {
  if ('body' in req) {
    for (const key in req.body) {
      if (allowedKeys.includes(key)) {
        return Promise.resolve(true)
      }
    }
    const values: string = allowedKeys.toString()
    const prettyValues = values.replace(/,/g, ', ')
    return Promise.reject(`Must have one of ${prettyValues}`)
  }
  return Promise.reject('body required')
}

export const isObject: CustomValidator = (value: any, { path }) => {
  if (typeof value === 'object') {
    return Promise.resolve(true) // return value is irrelevant
  }
  return Promise.reject(`${path} is not an Object`)
}

/*
  this is a common middleware function to check for express validator errors

  if express-validator found any errors, they are sent to error handlers here

  place this function in your route handler after your express-validations
  and before your final function

  e.g. router.get('/:id', checkSchema(altSchema), checkForClientErrors, routeHandlerFunction);
*/

export function checkForValidationErrors(request: Request, response: Response, next: NextFunction) {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    const httpError = new createError.BadRequest("Validation Failed")
    next(httpError) // go down error handling function stack.  A bad request handler needs to be in the stack
  }

  next() // call next function
}
