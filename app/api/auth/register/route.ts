import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registeredUserSchema } from "@/lib/validations/userValidation";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const pyload = await registeredUserSchema.parseAsync(await request.json());

    const existUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: pyload.email }, { phone: pyload.phone }],
      },
    });
    if (existUser)
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 403 }
      );

    const hashedPassword = await bcrypt.hash(pyload.password, 12);

    const newUser = await prisma.user.create({
      data: {
        firstName: pyload.firstName,
        middleName: pyload.middleName || "",
        lastName: pyload.lastName || "",
        email: pyload.email,
        password: hashedPassword,
        image: pyload.image || "",
        phone: pyload.phone || "",
        isActive: true,
      },
    });
    if (!newUser)
      return NextResponse.json(
        { seccess: false, message: "sumthing went worng" },
        { status: 500 }
      );

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          middleName: newUser.middleName,
          lastName: newUser.lastName,
          email: newUser.email,
          image: newUser.image,
          phone: newUser.phone,
          isEmailVerified: newUser.isEmailVerified,
          isPhoneVerified: newUser.isPhoneVerified,
          isActive: newUser.isActive,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.issues[0].message || "Invalid input data provided",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error &&
          `Failed to register user because ${error.message}`,
      },
      { status: 500 }
    );
  }
}
