import mongoose, { Schema, Model, Types } from "mongoose"
import { FavoriteDocument } from "../../../types/local/FavoriteModelTypes"
interface FavoriteModelStaticMethods extends Model<FavoriteDocument> {
    getFavorites(): Promise<FavoriteDocument[]>
    getFavoritesByProvider(provider: string): Promise<FavoriteDocument[]>,
    getFavoriteByName(name: string): Promise<FavoriteDocument>
}

const favoriteSchema = new Schema<FavoriteDocument>(
    {
        name: {type: String, required: true},
        provider: {type: String, required: true},
        notes:  {type: String, required: true},
        bAndaPicIds: {type: [Schema.Types.ObjectId], required: true},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date}
    }
)

favoriteSchema.statics.getFavorites = async function (
    name: string
): Promise<FavoriteDocument[]>
{
    return await FavoriteModel.find({})
}


favoriteSchema.statics.getFavoritesByProvider = async function (
    provider: string
): Promise<FavoriteDocument[]>
{
    return await FavoriteModel.find({ provider: { provider } })
}

favoriteSchema.statics.getFavoriteByName = async function (
    name: string
): Promise<FavoriteDocument>
{
    return await FavoriteModel.findOne({ favoriteName: { name } })
}

export const FavoriteModel = mongoose.model<FavoriteDocument, FavoriteModelStaticMethods>('Favorite',favoriteSchema) 