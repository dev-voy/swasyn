import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (
            (credentials?.email || credentials?.phone) &&
            !credentials?.password
          )
            throw new Error("Email and password are required");

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials?.email },
                { phone: credentials?.phone },
              ],
            },
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          let isPasswordCorrect;
          if (user.password) {
            isPasswordCorrect = await bcrypt.compare(
              credentials?.password || "",
              user.password
            );
          } else {
            throw new Error("Password not set for this user");
          }

          if (isPasswordCorrect) {
            return {
              id: user.id,
              firstName: user.firstName,
              middleName: user.middleName || "",
              lastName: user.lastName || "",
              image: user.image || "",
              email: user.email,
              phone: user.phone || "",
              isEmailVerified: user.isEmailVerified,
              isPhoneVerified: user.isPhoneVerified,
              role: user.role,
              isActive: user.isActive,
            };
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Sumthing Went Wrong"
          );
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, profile }) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            firstName: profile?.name?.split(" ")[0] || "User",
            middleName: profile?.name?.split(" ").slice(1, -1).join(" ") || "",
            lastName: profile?.name?.split(" ")[-1] || "",
            email: profile?.email || "",
            isEmailVerified: true,
            image: profile?.image,
          },
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.middleName = user.middleName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.phone = user.phone;
        token.image = user.image;
        token.role = user.role;
        token.isEmailVerified = user.isEmailVerified;
        token.isPhoneVerified = user.isPhoneVerified;
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id as string;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.user.avatar = token.avatar;
      session.user.role = token.role;
      session.user.isVerified = token.isVerified;
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXT_AUTH_SECRET,
};
