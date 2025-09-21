import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { ImageDisplay } from "../ImageDisplay";
import { bAndaAPI } from "../../services/bAndaAPI";
import { ValidationHelper } from "../../utils/ValidationHelper";

import {
  TextField,
  Button,
  Box,
  Typography,
  ButtonGroup,
  Stack,
  Chip,
} from "@mui/material";

import { FORM_MODE } from "../../constants/formMode";
import type {
  FavoriteDocDTO,
  FavoriteDTO,
} from "../../types/common/favoriteTypes";
import type { ImageDocDTO } from "../../types/common/ImageTypes";
import type { FormMode } from "../../types/local/FormMode";

interface GetImagesForFavoritesProps {
  mode: FormMode;
  favoriteId?: string;
}

export default function FavoriteForm({
  mode,
  favoriteId,
}: GetImagesForFavoritesProps) {
  const noErrors = {
    name: {
      error: false,
      helper: "Unique name that identifies this favorite set",
    },
    provider: { error: false, helper: "Category for favorite" },
    bAndaPicIds: { error: false, helper: "Images" },
    notes: { error: false, helper: "Patient id copied from AR" },
  };

  const [formError, setFormError] = useState(noErrors);
  const [favoriteIsLoading, setFavoriteIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<FavoriteDTO | FavoriteDocDTO>({
    name: "",
    provider: "",
    bAndaPicIds: [],
    notes: "",
  });

  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [debouncedFilterTags, setDebouncedFilterTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [imageList, setImageList] = useState<ImageDocDTO[]>([]);
  const [selectedImageList, setSelectedImageList] = useState<ImageDocDTO[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getAvailableTags = async () => {
      try {
        const tags = await bAndaAPI.image.getUniqueTags();
        setAvailableTags(tags);
      } catch (error) {}
    };

    const getFavoriteDoc = async () => {
      try {
        console.log("MODE", mode, favoriteId);
        if (mode == FORM_MODE.EDIT && favoriteId != undefined) {
          const favoriteDoc = await bAndaAPI.favorite.getById(favoriteId);
          setFormData({
            favoriteId: favoriteDoc.favoriteId,
            name: favoriteDoc.name,
            provider: favoriteDoc.provider,
            bAndaPicIds: favoriteDoc.bAndaPicIds,
            notes: favoriteDoc.notes,
          });

          const imagesList = await bAndaAPI.image.getListByIds(
            favoriteDoc.bAndaPicIds
          );
          setSelectedImageList(imagesList);
        }

        setFavoriteIsLoading(false);
      } catch (error) {}
    };
    getAvailableTags();
    getFavoriteDoc();
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

  const validators = {
    name: {
      validate: (_attributeName: string, _value: string): boolean => true,
    },
    provider: {
      validate: (_attributeName: string, _value: string): boolean => true,
    },
    bAndaPicIds: {
      validate: (_attributeName: string, _value: string): boolean => true,
    },
    notes: {
      validate: (_attributeName: string, _value: string): boolean => true,
    },
  };

  const validateForm = (): boolean => {
    let isValid: boolean = true;
    for (let key of Object.keys(validators)) {
      isValid &&= (validators as any)[key].validate(
        key,
        (formData as any)[key]
      );
    }
    return isValid;
  };

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

  const handleFormChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormCancel = () => {
    navigate("/favoritesList");
  };

  const imageOnClickHandler = (id: string) => {
    let selectedCopy = [];
    // is the image already in the selected Images list?
    if (
      selectedImageList.some((image: ImageDocDTO) => image.imageId == id) ==
      true
    ) {
      // remove selected image from selected images list
      selectedCopy = selectedImageList.filter(
        (image: ImageDocDTO) => image.imageId !== id
      );
    } else {
      // copy selected images so we can modify it
      selectedCopy = [...selectedImageList];
      // get selected image from image list
      const selectedImage = imageList.find(
        (image: ImageDocDTO) => image.imageId === id
      );
      //  add image to selected list
      if (selectedImage != undefined) {
        selectedCopy.push(selectedImage);
      }
    }
    setSelectedImageList(selectedCopy);
    console.log(selectedCopy);
  };

  const selectedImageOnClickHandler = (id: string) => {
    // is the image already in the selected Images list?
    if (
      selectedImageList.some((image: ImageDocDTO) => image.imageId == id) ==
      true
    ) {
      // remove selected image from selected images list
      const selectedCopy = selectedImageList.filter(
        (image: ImageDocDTO) => image.imageId !== id
      );
      setSelectedImageList(selectedCopy);
    }
  };

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    //  validate form
    console.log("SUBMIT ", mode);
    if (validateForm()) {
      try {
        // extract image ids from selectedImageList
        const imageIds = selectedImageList.map(
          (image: ImageDocDTO) => image.imageId
        );
        // put image list on copy
        const finalFormData = { ...formData, ["bAndaPicIds"]: imageIds };

        if (mode == FORM_MODE.CREATE) {
          await bAndaAPI.favorite.create(finalFormData);
        } else {
          // update
          if ("favoriteId" in finalFormData) {
            await bAndaAPI.favorite.update(finalFormData);
          }
        }
        navigate("/favoriteList");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // get response
          const response: any = error.response;
          // get validation object
          try {
            const validationErrors = new ValidationHelper(response.data);
            setFormError({ ...noErrors, ...validationErrors });
          } catch (error) {}
        }
      }
    }
  };

  if (favoriteIsLoading == true) {
    return (
      <>
        <Typography>Page Loading</Typography>
      </>
    );
  } else {
    return (
      <Stack direction="column" height="100" width="100%vw" spacing={2}>
        {/* Four Stacks in Top Stack*/}
        <Stack direction="row" height="75%" width="100%vw" spacing={2}>
          {/* Form Input */}
          <Stack direction="column" spacing={2}>
            <Box
              component="form"
              onSubmit={handleFormSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 400,
              }}
            >
              <TextField
                label="Favorite Name"
                name="name"
                value={formData.name}
                required
                error={formError.name.error}
                helperText={formError.name.helper}
                onChange={handleFormChange}
                variant="outlined"
                fullWidth
              />

              <TextField
                label="Provider"
                name="provider"
                value={formData.provider}
                required
                error={formError.provider.error}
                helperText={formError.provider.helper}
                onChange={handleFormChange}
                variant="outlined"
                fullWidth
              />

              <TextField
                label="Notes"
                name="notes"
                value={formData.notes}
                error={formError.notes.error}
                helperText={formError.notes.helper}
                onChange={handleFormChange}
                variant="outlined"
                fullWidth
              />
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button
                  sx={{ width: "50%" }}
                  variant="contained"
                  color="secondary"
                  onClick={handleFormCancel}
                >
                  Cancel
                </Button>
                <Button
                  sx={{ width: "50%" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleFormSubmit}
                >
                  Submit
                </Button>
              </ButtonGroup>
            </Box>
          </Stack>

          {/* Available Tags */}
          <Stack direction="column" height="100%" width="20%" spacing={2}>
            <Typography variant="h6">Available Tags</Typography>

            <Box
              sx={{
                width: "100%", // Set a fixed width for the scrollable box
                height: "70",
                minHeight: "70",
                maxHeight: "100%", // Set a maximum height to enable vertical scrolling
                overflowY: "auto", // Enable vertical scrolling when content overflows
                border: "1px solid grey", // Add a border for visibility
                padding: 1,
                display: "flex", // Arrange chips in a column
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
          <Stack direction="column" height="75" width="20%" spacing={2}>
            <Typography variant="h6">Filter Tags</Typography>

            <Box
              sx={{
                width: "100%", // Set a fixed width for the scrollable box
                height: "70",
                minHeight: "70",
                maxHeight: "100%", // Set a maximum height to enable vertical scrolling
                overflowY: "auto", // Enable vertical scrolling when content overflows
                border: "1px solid grey", // Add a border for visibility
                padding: 1,
                display: "flex", // Arrange chips in a column
                flexDirection: "row",
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
          <Stack direction="column" height="75%" width="60%" spacing={2}>
            <Typography variant="h6">Matching Images</Typography>

            <Box
              sx={{
                border: "1px solid grey", // Add a border for visibility
                position: "relative",
                width: "50%",
                height: "70%",
                maxHeight: "75%",
                display: "flex",
                justifyContent: "left",
                alignItems: "middle",
              }}
            >
              {imageList.map((image: ImageDocDTO) => {
                let imageBoarder = "none";
                if (
                  selectedImageList.some(
                    (selectedImage: ImageDocDTO) =>
                      selectedImage.imageId == image.imageId
                  ) == true
                ) {
                  imageBoarder = "5px solid blue";
                }
                return (
                  <Box
                    sx={{
                      border: imageBoarder, // Add a border for visibility
                      position: "relative",
                      width: "33%",
                      height: "33%",
                      maxHeight: "33%",
                      display: "flex",
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

        {/* Selected Items */}
        <Stack direction="column" height="25" width="100%" spacing={2}>
          <Typography variant="h6">Selected Images</Typography>

          <Box
            sx={{
              border: "1px solid grey", // Add a border for visibility
              position: "relative",
              width: "100%",
              height: "100%",
              maxHeight: "100%",
              display: "flex",
              justifyContent: "left",
              alignItems: "middle",
            }}
          >
            {selectedImageList.map((image: ImageDocDTO) => {
              return (
                <Box
                  sx={{
                    border: "2px solid blue", // Add a border for visibility
                    position: "relative",
                    width: "5",
                    height: "10%",
                    minHeight: "50%",
                    maxHeight: "5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "middle",
                  }}
                >
                  <Stack key={image.imageId} direction="row">
                    <ImageDisplay
                      imageClickHandler={selectedImageOnClickHandler}
                      id={image.imageId}
                      imageURL={image.bImageURL}
                      localFirst={true}
                      imgProps={{ width: 1, height: 1 }}
                    ></ImageDisplay>
                    <ImageDisplay
                      id={image.imageId}
                      imageClickHandler={selectedImageOnClickHandler}
                      imageURL={image.aImageURL}
                      localFirst={true}
                      imgProps={{ width: 1, height: 1 }}
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
}
