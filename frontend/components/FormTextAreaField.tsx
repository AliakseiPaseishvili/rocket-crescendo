import { FC } from "react";

import { Label } from "@/frontend/components/ui/label";
import { Textarea } from "@/frontend/components/ui/textarea";

interface FormTextAreaFieldProps {
  id: string;
  label: string;
  placeholder: string;
  rows?: number;
  errorMessage?: string;
  registration: object;
}

export const FormTextAreaField: FC<FormTextAreaFieldProps> = ({
  id,
  label,
  placeholder,
  rows,
  errorMessage,
  registration,
}) => (
  <div className="flex flex-col gap-1">
    <Label htmlFor={id}>{label}</Label>
    <Textarea id={id} placeholder={placeholder} rows={rows} {...registration} />
    {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
  </div>
);
