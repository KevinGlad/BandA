import { useLocation, useNavigate } from "react-router";
import { FavoriteDisplay } from "../components/FavoriteDisplay";

export default function PresentFavorite() {
  const navigate = useNavigate();
  const location = useLocation();
  const favoriteId = location.state?.favoriteId as string;
  return (
    <>
      <FavoriteDisplay favoriteId={favoriteId}></FavoriteDisplay>
    </>
  );
}
