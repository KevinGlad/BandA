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
  Grid,
  Typography,
  ButtonGroup,
  Stack,
  Chip,
} from "@mui/material";

import { FORM_MODE } from "../../constants/formMode";

import type { ImageDocDTO, ImageDTO } from "../../types/common/ImageTypes";
import type { FormMode } from "../../types/local/FormMode";

interface ImageFormProps {
  mode: FormMode;
  imageId?: string;
  parent: string;
}

//const url = "https://armedia.s3.us-west-2.amazonaws.com/32b3820630c5b13b32d10e261064712f/procedureImages/Procedure_image_17491608795763323262251062.jpg"
export default function ImageForm({ mode, imageId, parent }: ImageFormProps) {
  const [imageIsLoading, setImageIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<ImageDTO | ImageDocDTO>({
    name: "",
    bImageURL: "",
    aImageURL: "",
    clientId: "",
    procedure: "",
    tags: [],
  });

  const noErrors = {
    name: {
      error: false,
      helper: "Unique name that identifies this image set",
    },
    bImageURL: { error: false, helper: "Before image address copied from AR" },
    aImageURL: { error: false, helper: "After image address copied from AR" },
    clientId: { error: false, helper: "Patient id copied from AR" },
    procedure: { error: false, helper: "Procedure Name" },
    tags: { error: false, helper: "" },
  };

  const [formError, setFormError] = useState(noErrors);

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const getAvailableTags = async (): Promise<string[]> => {
      try {
        const tagList: string[] = await bAndaAPI.image.getUniqueTags();
        return tagList;
      } catch (error) {
        throw error;
      }
    };

    const getImageDocAndTags = async (
      tags: string[],
      imageId: string
    ): Promise<string[]> => {
      try {
        const imageDoc = await bAndaAPI.image.getById(imageId);
        setFormData({
          imageId: imageDoc.imageId,
          name: imageDoc.name,
          bImageURL: imageDoc.bImageURL,
          aImageURL: imageDoc.aImageURL,
          clientId: imageDoc.clientId,
          procedure: imageDoc.procedure,
          tags: imageDoc.tags,
        });
        // remove the tags from the available list that are already in the image list
        const filteredTags = tags.filter(
          (element) => !imageDoc.tags.includes(element)
        );
        return filteredTags;
      } catch (error) {
        throw error;
      }
    };

    const fillForm = async () => {
      let tags = await getAvailableTags();
      if (mode == FORM_MODE.EDIT && imageId != undefined) {
        tags = await getImageDocAndTags(tags, imageId);
      }
      setAvailableTags(tags);
      setImageIsLoading(false);
    };
    fillForm();
  }, []);

  // new tag delay
  useEffect(() => {
    const handler = setTimeout(() => {
      if (
        formData.tags.indexOf(newTag) == -1 &&
        availableTags.indexOf(newTag) == -1 &&
        newTag != ""
      ) {
        setFormData({
          ...formData,
          ["tags"]: formData.tags.concat(newTag),
        });
        setNewTag("");
      }
    }, 500); // delay

    return () => {
      clearTimeout(handler); // Clear timeout on unmount or re-render
    };
  }, [newTag]); // Re-run effect when inputValue changes

  const isImageDuplicateError = (
    attributeName: string,
    value: string
  ): boolean => {
    let rtnValue = false;
    let otherImageURL = "bImageURL";

    if (attributeName == "bImageURL") {
      otherImageURL = "aImageURL";
    }

    if (
      (formData as any)[otherImageURL] == value &&
      value != "" &&
      (formData as any)[otherImageURL] != ""
    ) {
      rtnValue = true;
      setFormError({
        ...formError,
        bImageURL: {
          ...["bImageURL"],
          helper: "Before and After Images are the same",
          error: true,
        },
        aImageURL: {
          ...["aImageURL"],
          helper: "Before and After Images are the same",
          error: true,
        },
      });
    } else {
      setFormError({
        ...formError,
        bImageURL: {
          ...["bImageURL"],
          helper: noErrors.bImageURL.helper,
          error: false,
        },
        aImageURL: {
          ...["aImageURL"],
          helper: noErrors.aImageURL.helper,
          error: false,
        },
      });
    }
    return rtnValue;
  };

  const validators = {
    name: {
      validate: (_attributeName: string, _value: string): boolean => true,
    },
    bImageURL: {
      validate: (attributeName: string, value: string): boolean => {
        return !isImageDuplicateError(attributeName, value);
      },
    },
    aImageURL: {
      validate: (attributeName: string, value: string): boolean => {
        return !isImageDuplicateError(attributeName, value);
      },
    },
    clientId: {
      validate: (_attributeName: string, _value: string): boolean => true,
    },
    procedure: {
      validate: (_attributeName: string, _value: string): boolean => true,
    },
    tags: {
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

  const handleNewTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const handleAvailableTagClick = (value: string) => () => {
    // remove from available tags
    setAvailableTags(availableTags.filter((item) => item !== value));
    // add to image tags
    setFormData({
      ...formData,
      ["tags"]: formData.tags.concat(value),
    });
  };

  const handleImageTagClick = (value: string) => () => {
    // remove from image tags array
    setFormData({
      ...formData,
      ["tags"]: formData.tags.filter((item) => item !== value),
    });
    // add to available tags array
    setAvailableTags(availableTags.concat(value).sort());
  };

  const handleFormDataChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    (validators as any)[event.target.name].validate(
      event.target.name,
      event.target.value
    );
  };

  const handleFormCancel = () => {
    navigate("/imageList");
  };

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    //  validate form

    if (validateForm()) {
      try {
        if (mode == FORM_MODE.CREATE) {
          await bAndaAPI.image.create(formData);
        } else {
          // update
          if ("imageId" in formData) {
            await bAndaAPI.image.update(formData);
          }
        }
        navigate("/imageList");
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
    <Grid container spacing={1} height="100vh" width="100%vw">
      <Grid
        flexDirection="column"
        spacing={2}
        width="60%"
        maxWidth="60%"
        height="100%"
        sx={{ border: "1px solid yellow" }}
      >
        {/* Form Data */}
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "full",
            maxWidth: "full",
            height: "50%",
            border: "1px solid grey",
          }}
        >
          <TextField
            label="Name for Image Set"
            name="name"
            value={formData.name}
            onChange={handleFormDataChange}
            variant="outlined"
            required
            error={formError.name.error}
            helperText={formError.name.helper}
            sx={{
              width: "100%",
            }}
          />

          <TextField
            label="Before Image URL"
            name="bImageURL"
            value={formData.bImageURL}
            onChange={handleFormDataChange}
            variant="outlined"
            required
            error={formError.bImageURL.error}
            helperText={formError.bImageURL.helper}
            sx={{
              width: "100%",
            }}
          />

          <TextField
            label="After Image URL"
            name="aImageURL"
            value={formData.aImageURL}
            onChange={handleFormDataChange}
            variant="outlined"
            required
            error={formError.aImageURL.error}
            helperText={formError.aImageURL.helper}
            sx={{
              width: "100%",
            }}
          />

          <Stack width="100%" direction="row" spacing={1}>
            <TextField
              label="Client Id"
              name="clientId"
              value={formData.clientId}
              onChange={handleFormDataChange}
              variant="outlined"
              required
              error={formError.clientId.error}
              helperText={formError.clientId.helper}
              sx={{
                width: "50%",
              }}
            />
            <TextField
              label="Procedure"
              name="procedure"
              value={formData.procedure}
              onChange={handleFormDataChange}
              variant="outlined"
              required
              error={formError.procedure.error}
              helperText={formError.procedure.helper}
              sx={{
                width: "50%",
              }}
            />
          </Stack>
        </Box>

        {/* Available Tags */}
        <Typography variant="h6">Available Tags</Typography>

        <Box
          sx={{
            width: "97%", // Set a fixed width for the scrollable box
            height: "20%",
            maxHeight: "20%", // Set a maximum height to enable vertical scrolling
            overflowY: "auto", // Enable vertical scrolling when content overflows
            border: "1px solid grey", // Add a border for visibility
            padding: 1,
            display: "flex", // Arrange chips in a column
            flexDirection: "row",
            gap: 1, // Spacing between chips      display: 'flex',
            flexWrap: "wrap",
            // p: 2, // padding around the container
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

        {/* Image Tags */}

        <Typography variant="h6">Image Tags</Typography>

        <Box
          sx={{
            width: "97%", // Set a fixed width for the scrollable box
            maxWidth: "100%",
            height: "10%",
            maxHeight: "10%", // Set a maximum height to enable vertical scrolling
            overflowY: "auto", // Enable vertical scrolling when content overflows
            border: "1px solid red", // Add a border for visibility
            padding: 1,
            display: "flex", // Arrange chips in a column
            flexDirection: "row",
            gap: 1, // Spacing between chips      display: 'flex',
            flexWrap: "wrap",
          }}
        >
          {formData.tags.map((label) => (
            <Chip
              sx={{
                width: 100,
                maxWidth: 100,
              }}
              color="secondary"
              key={label}
              label={label}
              onClick={handleImageTagClick(label)}
            />
          ))}
        </Box>

        {/* New Tag */}
        <Typography variant="h6">New Tag</Typography>

        <Box
          sx={{
            width: "100%", // Set a fixed width for the scrollable box
            // overflowY: "auto", // Enable vertical scrolling when content overflows
            border: "1px solid grey", // Add a border for visibility
          }}
        >
          <TextField
            label="New Tag"
            name="new tag"
            value={newTag}
            onChange={handleNewTagChange}
            variant="outlined"
            fullWidth
          />
        </Box>

        {/* Form Buttons */}
        <Box
          sx={{
            width: "50%",
            height: "10%",
          }}
        >
          <ButtonGroup variant="contained">
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
              Save
            </Button>
          </ButtonGroup>
        </Box>
      </Grid>

      <Grid
        flexDirection="column"
        spacing={2}
        columns={3}
        width="35%"
        maxWidth="35%"
        height="100%"
      >
        {/* B Image */}
        <Typography variant="h6">Before</Typography>

        <Box
          sx={{
            // display: "flex",
            // // flexDirection: "column",
            // gap: 2,
            width: "100%",
            maxWidth: "100%",

            height: "45%",
            maxHeight: "45%",
            objectFit: "contain",
          }}
        >
          <ImageDisplay
            id=""
            imageClickHandler={() => {}}
            imageURL={formData.bImageURL}
            localFirst={false}
            imgProps={{}}
          ></ImageDisplay>
        </Box>

        {/* a Image */}
        <Typography variant="h6">After</Typography>

        <Box
          sx={{
            // display: "flex",
            // // flexDirection: "column",
            // gap: 2,
            width: "100%",
            maxWidth: "100%",

            height: "45%",
            maxHeight: "45%",
            objectFit: "contain",
          }}
        >
          <ImageDisplay
            id=""
            imageClickHandler={() => {}}
            imageURL={formData.aImageURL}
            localFirst={false}
            imgProps={{}}
          ></ImageDisplay>
        </Box>
      </Grid>
    </Grid>
  );
}
