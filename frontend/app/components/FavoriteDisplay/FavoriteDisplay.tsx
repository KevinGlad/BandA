import { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import { ImageDisplay } from "../ImageDisplay";
import { bAndaAPI } from "../../services/bAndaAPI";

import type { FavoriteDocDTO } from "../../types/common/favoriteTypes";
import type { ImageDocDTO } from "../../types/common/ImageTypes";
interface FavoriteDisplayProps {
  favoriteId: string;
}

export default function FavoriteDisplay({ favoriteId }: FavoriteDisplayProps) {
  const [imageList, setImageList] = useState<ImageDocDTO[]>([]);
  const [justImage, setJustImage] = useState<string>("");
  const [imagesIsLoading, setImagesIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFavorite = async () => {
      try {
        const favorite: FavoriteDocDTO =
          await bAndaAPI.favorite.getById(favoriteId);
        const images: ImageDocDTO[] = await bAndaAPI.image.getListByIds(
          favorite.bAndaPicIds
        );
        setImageList(images);
        setImagesIsLoading(false);
      } catch (error) {}
    };
    getFavorite();
  }, []);

  const imageOnClickHandler = (id: string) => {
    if (justImage == "") {
      setJustImage(id);
    } else {
      setJustImage("");
    }
  };

  if (imagesIsLoading == true) {
    <Typography variant="h6">Images Loading</Typography>;
  } else {
    return (
      <Stack direction="column" height="100" width="100%vw" spacing={2}>
        {/* Images */}
        <Box
          sx={{
            border: "1px solid grey",
            position: "relative",
            width: "100%",
            height: "100%",
            maxHeight: "100%",
            display: "flex",
            justifyContent: "left",
            alignItems: "middle",
          }}
        >
          {imageList.map((image: ImageDocDTO) => {
            return (
              <Box
                sx={{
                  border: "none", 
                  position: "relative",
                  width: justImage == "" || justImage != image.imageId ? "33%" : "78%",
                  height: "33%",
                  maxHeight: "33%",
                  display:
                    justImage == "" || justImage == image.imageId
                      ? "flex"
                      : "none",
                  justifyContent: "center",
                  alignItems: "middle",
                }}
              >
                <Stack key={image.imageId} direction="row">
                  <ImageDisplay
                    imageClickHandler={imageOnClickHandler}
                    id={image.imageId}
                    imageURL={image.bImageURL}
                    localFirst={true}
                    imgProps={{ width: 10 }}
                  ></ImageDisplay>
                  <ImageDisplay
                    id={image.imageId}
                    imageClickHandler={imageOnClickHandler}
                    imageURL={image.aImageURL}
                    localFirst={true}
                    imgProps={{}}
                  ></ImageDisplay>
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Stack>
    );
  }
}
