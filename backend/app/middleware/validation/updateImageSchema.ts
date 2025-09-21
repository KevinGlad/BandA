import { Schema } from "express-validator";
import { ImageService } from "../../services/ImageService";
import { ImageModel } from "../../models/v1/ImageModel";
// this validator should match mongoose schema validator

// schema validate a new image request
const updateImageSchema: Schema = {
  imageId: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    trim: true,
    notEmpty: { errorMessage: "required", bail: true },
    isString: { errorMessage: "not string", bail: true },
  },
  name: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    trim: true,
    notEmpty: { errorMessage: "required", bail: true },
    isString: { errorMessage: "not string", bail: true },
    custom: {
      options: async (value, { req }) => {
        const { imageId } = req.body;
        const image = await ImageModel.findOne({
          name: value,
          _id: { $ne: imageId },
        });
        if (image != null) {
          return Promise.reject("duplicate");
        }
      },
      bail: true,
    },
  },
  bImageURL: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    trim: true,
    notEmpty: { errorMessage: "required", bail: true },
    isString: { errorMessage: "not string", bail: true },
    custom: {
      options: async (value) => {
        const image = await ImageService.findImageByURL(value);
        if (image != null && image.bImageURL != value) {
          return Promise.reject("duplicate");
        }
      },
      bail: true,
    },
  },
  aImageURL: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    trim: true,
    notEmpty: { errorMessage: "required", bail: true },
    isString: { errorMessage: "not string", bail: true },
    custom: {
      options: async (value) => {
        const image = await ImageService.findImageByURL(value);
        if (image != null && image.aImageURL != value) {
          return Promise.reject("duplicate");
        }
      },
      bail: true,
    },
  },
  clientId: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    trim: true,
    notEmpty: { errorMessage: "required", bail: true },
    isInt: { errorMessage: "not number", bail: true },
  },
  procedure: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    trim: true,
    notEmpty: { errorMessage: "required", bail: true },
    isString: { errorMessage: "not string", bail: true },
  },
  tags: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    notEmpty: { errorMessage: "required", bail: true },
    isArray: { errorMessage: "not array", bail: true },
  },
};

export default updateImageSchema;
