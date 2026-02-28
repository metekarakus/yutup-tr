"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { GoogleSignInButton } from "@/components/google-signin-button";

export function AuthButtons({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) {
    return (
      <div className="actions-row">
        <Link href="/panel" className="btn ghost">
          Panel
        </Link>
        <button className="btn ghost" onClick={() => signOut({ callbackUrl: "/" })}>
          Çıkış Yap
        </button>
      </div>
    );
  }

  return <GoogleSignInButton />;
}
