import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username as string;
        const password = credentials?.password as string;
        if (!username || !password) return null;

        const rows = await sql`
          SELECT id, username, password_hash, full_name, must_change_credentials
          FROM admins
          WHERE username = ${username}
          LIMIT 1
        `;
        const admin = rows[0];
        if (!admin) return null;

        const ok = await bcrypt.compare(
          password,
          admin.password_hash as string,
        );
        if (!ok) return null;

        return {
          id: admin.id as string,
          name: (admin.full_name ?? admin.username) as string,
          username: admin.username as string,
          mustChange: admin.must_change_credentials as boolean,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.username = (user as { username: string }).username;
        token.mustChange = (user as { mustChange: boolean }).mustChange;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.mustChange = token.mustChange as boolean;
      }
      return session;
    },
  },
});
