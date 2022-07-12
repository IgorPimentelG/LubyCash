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

export type ExtractEvent = {
  uuid: string;
  output: number;
  input: number;
  balance: number;
  description: string;
}
