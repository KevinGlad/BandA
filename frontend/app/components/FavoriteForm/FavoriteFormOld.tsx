import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import { ImageDisplay } from "../ImageDisplay";
import { ValidationHelper } from "../../utils/ValidationHelper";
import { bAndaAPI } from "../../services/bAndaAPI";

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
interface FavoriteFormProps {
  mode: FormMode;
  favoriteId?: string;
}

export default function FavoriteForm({
  mode,
  favoriteId,

}: FavoriteFormProps) {

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
  const [favoriteIsLoading, setFavoritIsLoading] = useState<boolean>(true);
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

  const navigate = useNavigate();

  useEffect(() => {
    const getAvailableTags = async () => {
      try {
        const tags = await bAndaAPI.image.getUniqueTags();
        setAvailableTags(tags);
      } catch (error) {}
    };
    getAvailableTags();
  }, []);

  // filter change delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterTags(filterTags);
    }, 500); // delay

    return () => {
      clearTimeout(handler); // Clear timeout on unmount or re-render
    };
  }, [filterTags]); // Re-run effect when inputValue changes

  // get new images from filter
  useEffect(() => {
    const getImagesByTags = async () => {
      try {
        const images: ImageDocDTO[] =
          await bAndaAPI.image.getListByTags(debouncedFilterTags);
        setImageList(images);
      } catch (error) {}
    };
    if (debouncedFilterTags.length > 0) {
      getImagesByTags();
    } else {
      setImageList([]);
    }
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

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    //  validate form

    if (validateForm()) {
      try {
        if (mode == FORM_MODE.CREATE) {
          await bAndaAPI.favorite.create(formData);
        } else {
          // update
          if ("favoriteId" in formData) {
            await bAndaAPI.favorite.update(formData);
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

  return (
    <Stack direction="row" spacing={2}>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
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
          >
            Submit
          </Button>
        </ButtonGroup>
      </Box>

      <Stack direction="column" spacing={2}>
        {/* Available Tags */}
        <Typography variant="h6">Available Tags</Typography>

        <Box
          sx={{
            width: "98%", // Set a fixed width for the scrollable box
            height: "30%",
            maxHeight: "30%", // Set a maximum height to enable vertical scrolling
            overflowY: "auto", // Enable vertical scrolling when content overflows
            border: "1px solid grey", // Add a border for visibility
            padding: 1,
            display: "flex", // Arrange chips in a column
            flexDirection: "column",
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

      <Stack direction="column" spacing={2}>
        {/* Image Tags */}
        <Typography variant="h6">Filter Tags</Typography>

        <Box
          sx={{
            width: "100%", // Set a fixed width for the scrollable box
            height: 400,
            maxHeight: 400, // Set a maximum height to enable vertical scrolling
            overflowY: "auto", // Enable vertical scrolling when content overflows
            border: "1px solid grey", // Add a border for visibility
            padding: 1,
            display: "flex", // Arrange chips in a column
            flexDirection: "column",
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

      <Stack direction="column" spacing={2}>
        <Typography variant="h6">Matching Images</Typography>

        {/* Images */}
        <Box
          sx={{
            border: "1px solid grey", // Add a border for visibility
            position: "relative",
            width: "full",
            height: "10%",
            maxHeight: "10%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {imageList.map((image: ImageDocDTO) => {
            return (
              <Stack key={image.bImageURL} direction="row">
                <ImageDisplay
                  id={image.imageId}
                  imageClickHandler={() => {}}
                  imageURL={image.bImageURL}
                  localFirst={true}
                  imgProps={{}}
                ></ImageDisplay>
                <ImageDisplay
                  id={image.imageId}
                  imageClickHandler={() => {}}
                  imageURL={image.aImageURL}
                  localFirst={true}
                  imgProps={{}}
                ></ImageDisplay>
              </Stack>
            );
          })}
        </Box>
      </Stack>
    </Stack>
  );
}
