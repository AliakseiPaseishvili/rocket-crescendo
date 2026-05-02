type AvatarFallbackInput = {
  name?: string | null;
  lastName?: string | null;
  username?: string | null;
};

export const getAvatarFallback = ({
  name,
  lastName,
  username,
}: AvatarFallbackInput): string => {
  if (name && lastName) {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  return (name || username || "?").charAt(0).toUpperCase();
};
