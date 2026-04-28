export type SignUpFormValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: "" | "male" | "female";
  birthdate: string;
};

export type SignInFormValues = {
  identifier: string;
  password: string;
};
