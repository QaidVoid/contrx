export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export type SafeUser = Omit<User, "password">;

export type NewUser = Omit<User, "id"> & {
  confirm_password: string;
};

export type LoginUser = {
  email: string;
  password: string;
};
