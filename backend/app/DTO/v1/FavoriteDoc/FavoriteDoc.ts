import { FavoriteDocument } from "../../../types/local/FavoriteModelTypes";
import { FavoriteDocDTO } from "../../../types/common/FavoriteTypes";

class FavoriteDoc implements FavoriteDocDTO {
    favoriteId: string = ""
    name: string = ""
    provider: string = ""
    bAndaPicIds: string[] = []
        notes: string = ""

    constructor(favoriteDoc: FavoriteDocument) {
        this.favoriteId = favoriteDoc._id.toHexString() ?? this.favoriteId
        this.name = favoriteDoc.name ?? this.name
        this.provider = favoriteDoc.provider ?? this.provider
        this.bAndaPicIds = favoriteDoc.bAndaPicIds.map(objectId => objectId.toHexString())
        this.notes = favoriteDoc.notes ?? this.notes
    }
}
export default FavoriteDoc