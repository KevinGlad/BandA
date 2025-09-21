import { Schema } from "express-validator";
import { FavoriteService } from "../../services/FavoriteService";
// this validator should match mongoose schema validator

// schema validate a new image request
const createFavoriteSchema: Schema = {
  name: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    trim: true,
    notEmpty: { errorMessage: "required", bail: true },
    isString: { errorMessage: "not string", bail: true },
    custom: {
      options: async (value) => {
        const image = await FavoriteService.findFavoriteByName(value);
        if (image != null) {
          return Promise.reject("duplicate");
        }
      },
      bail: true,
    },
  },
  provider: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    trim: true,
    notEmpty: { errorMessage: "required", bail: true },
    isString: { errorMessage: "not string", bail: true },
  },
  bAndaPicIds: {
    in: ["body"],
    exists: { errorMessage: "missing", bail: true },
    trim: true,
    notEmpty: { errorMessage: "required", bail: true },
    isArray: { errorMessage: "not array", bail: true },
  },
};

export default createFavoriteSchema;
