import NextAuth, { type NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      if (!account || account.provider !== "google" || !profile) return false;
      const googleSub = String((profile as Record<string, unknown>).sub ?? "");
      if (!googleSub || !user.email) return false;

      await prisma.user.upsert({
        where: { googleSub },
        update: {
          email: user.email,
          name: user.name,
          image: user.image
        },
        create: {
          googleSub,
          email: user.email,
          name: user.name,
          image: user.image
        }
      });

      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile) {
        token.googleSub = String((profile as Record<string, unknown>).sub ?? "");
        token.email = user.email;
      }

      if (token.googleSub) {
        const dbUser = await prisma.user.findUnique({ where: { googleSub: String(token.googleSub) } });
        if (dbUser) {
          token.userId = dbUser.id;
          token.customSlugQuotaUsed = dbUser.customSlugQuotaUsed;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.customSlugQuotaUsed = Number(token.customSlugQuotaUsed ?? 0);
      }
      return session;
    }
  }
};

export const authHandler = NextAuth(authOptions);

export async function getAuthSession() {
  return getServerSession(authOptions);
}
