import { Schema } from "express-validator";
import { FavoriteModel } from "../../models/v1/FavoriteModel";
// this validator should match mongoose schema validator

// schema validate a new image request
const createFavoriteSchema: Schema = {
  favoriteId: {
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
      options: async (value, {req}) => {
        const { favoriteId } = req.body;
        const favorite = await FavoriteModel.findOne({ name: value, _id: { $ne: favoriteId } });
        if (favorite != null) {
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
