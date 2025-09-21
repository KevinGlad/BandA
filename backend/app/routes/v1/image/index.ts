import express from 'express'
const router = express.Router()
import { checkSchema } from 'express-validator'
import  createImageSchema  from  "../../../middleware/validation/createImageSchema"
import updateImageSchema from '../../../middleware/validation/updateImageSchema'
import {checkForValidationErrors} from "../../../middleware/validation/common"

import { getImageList, getImageByURL, getImageById, getImagesByTags, getUniqueTags } from "./get"
import { createImage, getImagesByIds } from "./post"
import { updateImage } from './put'
import { deleteImage } from "./delete"

router.get("/", getImageList)
router.get("/imagesByTags", getImagesByTags)
router.get("/imageByURL", getImageByURL)
router.get("/uniqueTags", getUniqueTags)
router.get("/:imageId", getImageById)

router.post("/", checkSchema(createImageSchema), checkForValidationErrors, createImage)
router.post("/imagesByIds", getImagesByIds)
router.put("/", checkSchema(updateImageSchema), checkForValidationErrors, updateImage)

router.delete("/:imageId",deleteImage)

export default router