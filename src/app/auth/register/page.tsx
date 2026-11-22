import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = { title: "ثبت‌نام در هنربازار" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; role?: string }>;
}) {
  const sp = await searchParams;
  const role = sp.role === "seller" ? "seller" : "buyer";
  return <AuthForm mode="register" next={sp.next ?? "/"} initialRole={role} />;
}
