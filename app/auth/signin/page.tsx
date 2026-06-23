import type { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign in — HandyHire",
};

export default function SignInPage() {
  return <SignInForm />;
}
