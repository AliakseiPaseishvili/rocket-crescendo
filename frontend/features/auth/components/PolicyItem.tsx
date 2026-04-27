import { Check, X } from 'lucide-react';

type Props = {
  label: string;
  met: boolean;
};

export const PolicyItem = ({ label, met }: Props) => (
  <li className="flex items-center gap-1.5 text-sm">
    {met ? (
      <Check className="size-3.5 shrink-0 text-green-500" />
    ) : (
      <X className="size-3.5 shrink-0 text-muted-foreground" />
    )}
    <span className={met ? 'text-green-600' : 'text-muted-foreground'}>{label}</span>
  </li>
);
