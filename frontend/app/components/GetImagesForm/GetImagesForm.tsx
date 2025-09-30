import { useState, useEffect } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { useNavigate } from "react-router";
import { ImageDisplay } from "../ImageDisplay";
import { bAndaAPI } from "../../services/bAndaAPI";

import type { ImageDocDTO } from "../../types/common/ImageTypes";

export default function GetImagesForm() {
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [debouncedFilterTags, setDebouncedFilterTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [imageList, setImageList] = useState<ImageDocDTO[]>([]);
  const [justImage, setJustImage] = useState<string>("");

  const navigate = useNavigate();
  useEffect(() => {
    const getUniqueTags = async () => {
      try {
        const tags = await bAndaAPI.image.getUniqueTags();
        setAvailableTags(tags);
      } catch (error) {}
    };
    getUniqueTags();
  }, []);

  // filter change delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterTags(filterTags);
    }, 700); // delay

    return () => {
      clearTimeout(handler); // Clear timeout on unmount or re-render
    };
  }, [filterTags]); // Re-run effect when inputValue changes

  // get new images from filter
  useEffect(() => {
    const getImages = async () => {
      if (debouncedFilterTags.length > 0) {
        const images: ImageDocDTO[] =
          await bAndaAPI.image.getListByTags(debouncedFilterTags);
        setImageList(images);
      } else {
        setImageList([]);
      }
    };
    getImages();
  }, [debouncedFilterTags]); // Re-run effect when inputValue changes

  const handleAvailableTagClick = (value: string) => () => {
    // remove from available tags
    const availableTagsResult = availableTags.filter((item) => item !== value);
    // add to image tags
    const imageTagsResult = filterTags.concat(value);
    setAvailableTags(availableTagsResult);
    setFilterTags(imageTagsResult);
  };

  const handleFilterTagClick = (value: string) => () => {
    // remove from image tags
    const imageTagsResult = filterTags.filter((item) => item !== value);
    // add to available tags
    const availableTagsResult = availableTags.concat(value);
    availableTagsResult.sort();
    setFilterTags(imageTagsResult);
    setAvailableTags(availableTagsResult);
  };

  const handleCancel = () => {
    navigate("/home");
  };

  const imageOnClickHandler = (id: string) => {
    if (justImage == "") {
      setJustImage(id);
    } else {
      setJustImage("");
    }
  };

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ height: "500px", width: "100%vw" }}
    >
      {/* Available Tags */}
      <Stack
        direction="column"
        height="100%"
        width="16%"
        spacing={2}
        sx={{ display: justImage ? "none" : "flex" }}
      >
        <Typography variant="h6">Available Tags</Typography>

        <Box
          sx={{
            width: "100%", // Set a fixed width for the scrollable box
            height: "100%",
            minHeight: "100%",
            maxHeight: "100%", // Set a maximum height to enable vertical scrolling
            overflowY: "auto", // Enable vertical scrolling when content overflows
            border: "1px solid grey", // Add a border for visibility
            padding: 1,
            display: "flex", // Arrange chips in rows
            flexDirection: "row",
            gap: 1, // Spacing between chips
          }}
        >
          {availableTags.map((label) => (
            <Chip
              sx={{
                width: 100,
                maxWidth: 100,
              }}
              color="primary"
              key={label}
              label={label}
              onClick={handleAvailableTagClick(label)}
            />
          ))}
        </Box>
      </Stack>

      {/* Image Tags */}
      <Stack
        direction="column"
        spacing={2}
        sx={{
          height: "100%",
          width: "16%",
          display: justImage ? "none" : "flex",
        }}
      >
        <Typography variant="h6">Filter Tags</Typography>

        <Box
          sx={{
            width: "100%", // Set a fixed width for the scrollable box
            height: "100%",
            minHeight: "100%",
            maxHeight: "100%", // Set a maximum height to enable vertical scrolling
            overflowY: "auto", // Enable vertical scrolling when content overflows
            border: "1px solid grey", // Add a border for visibility
            padding: 1,
            display: "flex", // Arrange chips in a column
            flexDirection: "row",
            overflow: "auto",
            gap: 1, // Spacing between chips
          }}
        >
          {filterTags.map((label) => (
            <Chip
              sx={{
                width: 100,
                maxWidth: 100,
              }}
              color="secondary"
              key={label}
              label={label}
              onClick={handleFilterTagClick(label)}
            />
          ))}
        </Box>
      </Stack>

      {/* Images */}
      <Stack
        direction="column"
        spacing={2}
        sx={{
          // height: justImage == "" ? "75%" : "100%",
          width: justImage == "" ? "68%" : "100%",
        }}
      >
        <Typography variant="h6">Matching Images</Typography>

        <Box
          sx={{
            border: "1px solid grey", // Add a border for visibility
            position: "relative",
            width: "100%",
            minHeight: "100%",
            maxHeight: justImage == "" ? "100%" : "",
            display: justImage == "" ? "flex" : "",
            overflow: justImage == "" ? "auto" : "",
            justifyContent: justImage == "" ? "left" : "center",
            alignItems: "middle",
          }}
        >
          {imageList.map((image: ImageDocDTO) => {
            return (
              <Box
                sx={{
                  border: "none", // Add a border for visibility
                  position: "relative",
                  width:
                    justImage == "" || justImage != image.imageId
                      ? "200px"
                      : "70%",
                  // display:
                  //   justImage == "" || justImage == image.imageId
                  //     ? ""
                  //     : "none",
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
    </Stack>
  );
}
