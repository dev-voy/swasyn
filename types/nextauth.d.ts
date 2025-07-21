import "next-auth";
/*
model User {
  id              String   @id @default(cuid())
  firstName       String   @map("first_name")
  lastName        String?  @map("last_name")
  middleName      String?  @map("middle_name")
  image           String?
  email           String   @unique
  isEmailVerified Boolean  @default(false) @map("is_email_verified")
  phone           String?  @unique
  isPhoneVerified Boolean  @default(false) @map("is_phone_verified")
  password        String?
  role            Roll     @default(USER) @map("user_role")
  isActive        Boolean  @default(true) @map("is_active")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @default(now()) @updatedAt
}
*/
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      middleName?: string;
      lastName?: string;
      image?: string;
      email: string;
      phone?: string;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
      role: string;
      isActive: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    firstName: string;
    middleName?: string;
    lastName?: string;
    image?: string;
    email: string;
    phone?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    role: string;
    isActive: boolean;
  }
}
