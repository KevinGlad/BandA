import { FIELD_ERROR_IDENTIFIER } from "../../types/common/ImageTypes";

class ValidationHelper {

    constructor(
        errorResponse: object
    )
    {

        if (Object.hasOwn(errorResponse, FIELD_ERROR_IDENTIFIER)) {
            let fieldErrors = (errorResponse as any)[FIELD_ERROR_IDENTIFIER]
            console.log("fieldErrors",fieldErrors)
            for (let key in fieldErrors) {
                (this as any)[key] = {error: true, helper: fieldErrors[key]}
            }
        } else {
            throw new Error("Not Validation Errors")
        }
    }

}

export default ValidationHelper