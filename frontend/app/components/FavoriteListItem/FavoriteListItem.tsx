import { useState, useEffect } from "react";
import {
  Typography,
  Stack,
} from "@mui/material";

interface FavoriteListItemProps {
    name: string
    provider: string
    date: Date
}

export default function FavoriteItem(
    {
        name,
        provider,
        date,
    }: FavoriteListItemProps
)
{

  return (
    <Stack direction="row">
        <Typography variant="h6">{name}</Typography>
        <Typography variant="h6">{provider}</Typography>
        <Typography variant="h6">{date.toString()}</Typography>

    </Stack>
  );
}
