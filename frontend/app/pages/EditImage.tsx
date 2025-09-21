import { useLocation, useNavigate } from "react-router";

import { ImageForm } from "../components/ImageForm";
import { FORM_MODE } from "../constants/formMode";

function EditImage() {

  const navigate = useNavigate();
  const location = useLocation();
  const imageId = location.state?.imageId as string

  return <ImageForm mode={FORM_MODE.EDIT} imageId={imageId} parent="PEdit"></ImageForm>;
}

export default EditImage