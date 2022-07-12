export type ClientRegisterEvent = {
  uuid: string;
  email: string;
  firstName: string;
}

export type ForgotPasswordEvent = {
  email: string;
  firstName: string;
  token: string;
}
