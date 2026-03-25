import { FC } from "react";

import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";

interface FormInputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  errorMessage?: string;
  registration: object;
}

export const FormInputField: FC<FormInputFieldProps> = ({
  id,
  label,
  placeholder,
  errorMessage,
  registration,
}) => (
  <div className="flex flex-col gap-1">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type="text" placeholder={placeholder} {...registration} />
    {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
  </div>
);
