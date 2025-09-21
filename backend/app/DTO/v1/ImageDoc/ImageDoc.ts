import { ImageDocument } from "../../../types/local/ImageModelTypes";
import type { ImageDocDTO } from "../../../types/common/ImageTypes";

class ImageDoc implements ImageDocDTO {
    imageId: string = ""
    name: string = ""
    bImageURL: string = ""
    aImageURL: string = ""
    clientId: string = ""
    procedure: string = ""
    tags: string[] = []
    
    constructor(imageDoc: ImageDocument) {
    this.imageId = imageDoc._id.toHexString() ?? this.imageId
    this.name = imageDoc.name ?? this.name
    this.bImageURL = imageDoc.bImageURL ?? this. bImageURL
    this.aImageURL = imageDoc.aImageURL ?? this. aImageURL
    this.clientId  = imageDoc.clientId ?? this.clientId
    this.procedure = imageDoc.procedure ?? this.procedure
    this.tags = imageDoc.tags.map(tag => tag)
    }
}
export default ImageDoc