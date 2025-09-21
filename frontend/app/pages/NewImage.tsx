import { ImageForm } from "../components/ImageForm"
import { FORM_MODE } from "../constants/formMode"

export default function NewImage(){

    // const image = new Image()

    return (
        <ImageForm mode={FORM_MODE.CREATE} parent="PNew"></ImageForm>
    )
}
