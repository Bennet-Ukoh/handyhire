import type { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create account — HandyHire",
};

interface Props {
  searchParams: Promise<{ role?: string }>;
}

export default async function SignUpPage({ searchParams }: Props) {
  const { role } = await searchParams;
  const initialRole = role === "worker" ? "worker" : "client";
  return <SignUpForm initialRole={initialRole} />;
}
