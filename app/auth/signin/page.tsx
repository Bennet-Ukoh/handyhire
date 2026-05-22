import type { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign in — HandyHire",
};

interface Props {
  searchParams: Promise<{ registered?: string }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const { registered } = await searchParams;
  return <SignInForm registered={registered === "true"} />;
}
