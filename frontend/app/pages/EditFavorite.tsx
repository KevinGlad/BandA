import { useLocation, useNavigate } from "react-router";
import { FavoriteForm } from "../components/FavoriteForm";

import { FORM_MODE } from "../constants/formMode";

export default function editFavorite() {
  const location = useLocation();
  const favoriteId = location.state?.favoriteId as string;

  console.log("FAV ID", favoriteId)
  return (
    <>
      <FavoriteForm
        mode={FORM_MODE.EDIT}
        favoriteId={favoriteId}
      ></FavoriteForm>
    </>
  );
}
