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
          console.log("user", user);
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
        // const newUser = await prisma.user.create({
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
        // user = {
        //   ...user,
        //   id: newUser.id,
        //   firstName: newUser.firstName,
        //   middleName: newUser.middleName || "",
        //   lastName: newUser.lastName || "",
        //   image: newUser.image || "",
        //   email: newUser.email,
        //   phone: newUser.phone || "",
        //   isEmailVerified: newUser.isEmailVerified,
        //   isPhoneVerified: newUser.isPhoneVerified,
        //   role: newUser.role,
        //   isActive: newUser.isActive,
        // },
      }
      // else {
      //   user = {
      //     ...user,
      //     id: existingUser.id,
      //     firstName: existingUser.firstName,
      //     middleName: existingUser.middleName || "",
      //     lastName: existingUser.lastName || "",
      //     image: existingUser.image || "",
      //     email: existingUser.email,
      //     phone: existingUser.phone || "",
      //     isEmailVerified: existingUser.isEmailVerified,
      //     isPhoneVerified: existingUser.isPhoneVerified,
      //     role: existingUser.role,
      //     isActive: existingUser.isActive,
      //   };
      // }

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
      session.user.id = token.id;
      session.user.firstName = token.firstName;
      session.user.middleName = token.middleName;
      session.user.lastName = token.lastName;
      session.user.image = token.image;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.user.isEmailVerified = token.isEmailVerified;
      session.user.isPhoneVerified = token.isPhoneVerified;
      session.user.isActive = token.isActive;
      session.user.role = token.role;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXT_AUTH_SECRET,
};
