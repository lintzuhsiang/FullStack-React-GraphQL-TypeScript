import { UserNamePasswordInput } from "../resolvers/UserNamePasswordInput";

export const validateRegister = (options: UserNamePasswordInput) => {
  console.log('options',options)
  if (!options.email.includes('@')) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "username length should be greater than 2",
      },
    ];
  }
  if (options.username.includes('@')) {
    return [
      {
        field: "username",
        message: "username can't include @ sign",
      },
    ];
  }
  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "password length should be greater than 2",
      },
    ];
  }
  return null;
};
