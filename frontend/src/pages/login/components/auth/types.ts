import type { InferType } from "yup";
import type { loginSchema } from "./login-schema";

export type LoginValues = InferType<typeof loginSchema>;

export type SocialProvider = "google" | "apple";

export interface LoginFormProps {
  onLogin?: (values: LoginValues) => Promise<void>;
  onSocialLogin?: (provider: SocialProvider) => Promise<void>;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
  showSocialLogin?: boolean;
  disabled?: boolean;
}
