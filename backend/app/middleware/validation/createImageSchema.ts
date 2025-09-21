import { Schema } from "express-validator";
import { ImageService } from "../../services/ImageService";
// this validator should match mongoose schema validator

// schema validate a new image request
const createImageSchema: Schema = {
  name: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    trim: true,
    notEmpty: { errorMessage: "required", bail: true },
    isString: { errorMessage: "not string", bail: true },
    custom: {
      options: async (value) => {
        const image = await ImageService.findImageByName(value);
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
        if (image != null) {
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
        if (image != null) {
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

export default createImageSchema;
