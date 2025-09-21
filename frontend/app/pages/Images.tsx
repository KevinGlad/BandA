import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { bAndaAPI } from "../services/bAndaAPI";
import { ImageListForm } from "../components/ImageListForm";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

import type { ImageDocDTO } from "../types/common/ImageTypes";

export default function Images() {
  const [imageList, setImageList] = useState<ImageDocDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const images: ImageDocDTO[] = await bAndaAPI.image.getList();
        setLoading(false);
        setImageList(images);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  const editHandler = (id: string) => {
    navigate('/editImage', { state: { imageId: id } });
  };

  const deleteHandler = (id: string) => {
    bAndaAPI.image.delete(id)
    // set images list to [] to tiger reload from db
    setImageList([])
  };

  const addImageHandler = () => {
    navigate("/newImage")
  }

  return (
    <div>
      <Box sx={{ "& > button": { m: 1 } }}>
        <Button variant="contained" endIcon={<AddIcon />} onClick={addImageHandler}>
          Add Image
        </Button>
      </Box>
      <ImageListForm
        imageList={imageList}
        editHandler={editHandler}
        deleteHandler={deleteHandler}
      ></ImageListForm>
    </div>
  );
}
