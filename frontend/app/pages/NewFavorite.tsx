import { FavoriteForm } from "../components/FavoriteForm"
import { FORM_MODE } from "../constants/formMode"

export default function NewFavorite(){
    
    return (
        <FavoriteForm mode={FORM_MODE.CREATE}></FavoriteForm>
    )
}
