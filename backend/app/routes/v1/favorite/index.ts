import express from 'express'
const router = express.Router()
import { checkSchema } from 'express-validator'
import  createFavoriteSchema  from  "../../../middleware/validation/createFavoriteSchema"
import updateFavoriteSchema from '../../../middleware/validation/updateFavoriteSchema'
import {checkForValidationErrors} from "../../../middleware/validation/common"


import { createFavorite } from "./post"
import { getFavorites, getFavoritesByProvider, getFavoriteByName, getFavoriteById} from "./get"
import { updateFavorite } from './put'
import { deleteFavorite } from './delete'

router.get("/", getFavorites)
router.get("/provider/:provider", getFavoritesByProvider)
router.get("/name/:name", getFavoriteByName)
router.get("/:favoriteId", getFavoriteById)

router.post("/", checkSchema(createFavoriteSchema), checkForValidationErrors, createFavorite)

router.put("/", checkSchema(updateFavoriteSchema), checkForValidationErrors, updateFavorite)

router.delete("/:favoriteId",deleteFavorite)
export default router