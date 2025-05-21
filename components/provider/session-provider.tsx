"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

type NextAuthSessionProviderProps = Readonly<{
  children: React.ReactNode;
  session?: Session | null;
}>;

export default function NextAuthSessionProvider({
  children,
  session,
}: NextAuthSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
