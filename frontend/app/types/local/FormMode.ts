import { FORM_MODE } from "../../constants/formMode";

export type FormMode = typeof FORM_MODE[keyof typeof FORM_MODE]
