import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { CardMedia, CircularProgress, Card, Typography } from "@mui/material";
import { DEV_REDIRECT } from "../../constants/serverConstants";

interface ImageDisplayProps {
  id: string
  imageURL: string;
  localFirst: boolean;
  imageClickHandler: (id: string) => void,
  imgProps: object;
}

export default function ImageDisplay({
  id,
  imageURL,
  localFirst,
  imageClickHandler: parentOnClickHandler,
  ...imgProps
}: ImageDisplayProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [url, setURL] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("No Image");

  useEffect(() => {
    if (URL.parse(imageURL) != null) {
      if (localFirst) {
        const localImageFilename = URL.parse(imageURL)
          ?.pathname.split("/")
          .filter(Boolean)
          .pop();
        let localImageURL = `${DEV_REDIRECT}/${localImageFilename}`;
        setURL(localImageURL);
      } else {
        setURL(imageURL);
      }
      setStatusMessage("Loading");
    } else {
      setURL("");
      setLoaded(false);
      setStatusMessage("No Image");
    }
  });

  const handleLoaded = () => {
    setLoaded(true);
  };

  const handleError = (_event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (URL.parse(imageURL) != null) {
      if (localFirst && url != "") {
        setStatusMessage("Local load failure");

        // try internet
        setLoaded(false);
        setURL(imageURL);
      } else {
        setStatusMessage("Image load failure");
        setLoaded(true);
      }
    }
  };

  const preLoadedMessage = () => {
    if (loaded == false) {
      return <Typography variant="h6">{statusMessage}</Typography>;
    }
  };

  const onClickHandler = (id: string) => () => {
    parentOnClickHandler(id)
  }
  return (
    <>
      {preLoadedMessage()}
      <Card>
        <CardMedia
          component="img"
          loading="lazy" // Native lazy loading
          onClick={onClickHandler(id)}
          onLoad={handleLoaded}
          onError={handleError} // Handle error case as loaded for display
          image={url}
          sx={{
            height: "100%",
            width: "100%",
            objectfit: "cover",
          }}
          {...imgProps}
        />
      </Card>
    </>
  );
}
