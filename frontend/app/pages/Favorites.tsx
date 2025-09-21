import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { bAndaAPI } from "../services/bAndaAPI";
import { FavoriteListForm} from "../components/FavoriteListForm";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

import type { FavoriteDocDTO } from "../types/common/favoriteTypes";

export default function Favorites() {
  const [favoriteList, setFavoriteList] = useState<FavoriteDocDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const favoriteList: FavoriteDocDTO[] = await bAndaAPI.favorite.getList();

        setFavoriteList(favoriteList);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayHandler = (id: string) => {
        navigate('/presentFavorite', { state: { favoriteId: id } });
  }

  const editHandler = (id: string) => {
    navigate('/editFavorite', { state: { favoriteId: id } });
  };

  const deleteHandler = (id: string) => {
    bAndaAPI.favorite.delete(id)
    // set images list to [] to tiger reload from db
    setFavoriteList([])
//ToDO
  };

  const addFavoriteHandler = () => {
    navigate("/newFavorite")
  }

  return (
    <div>
      <Box sx={{ "& > button": { m: 1 } }}>
        <Button variant="contained" endIcon={<AddIcon />} onClick={addFavoriteHandler}>
          Add Favorite
        </Button>
      </Box>
      <FavoriteListForm
        favoriteList={favoriteList}
        displayHandler={displayHandler}
        editHandler={editHandler}
        deleteHandler={deleteHandler}
      ></FavoriteListForm>
    </div>
  );
}

