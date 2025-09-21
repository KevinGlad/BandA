import { useState, useEffect } from "react";
import {
  Typography,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete"

import type { ImageListItem } from "../../types/common/ImageTypes";

interface ImageListItemProps extends ImageListItem {}


export default function ImageItem(
    {
        _id,
        name,
        procedure,
        aImageURL,
        bImageURL,
    }: ImageListItemProps
)
{

  return (
    <Stack direction="row">
        <Typography variant="h6">{name}</Typography>
        <Typography variant="h6">{procedure}</Typography>
    </Stack>
  );
}
