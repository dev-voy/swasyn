import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ZodError } from "zod";
import { doctorRegisteredSchema } from "@/lib/validations/doctorValidation";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, message: "Doctors fetched successfully", doctors },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while fetching doctors",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const pyload = await doctorRegisteredSchema.parseAsync(
      await request.json()
    );

    const newDoctor = await prisma.doctor.create({
      data: {
        userId: pyload.userId,
        specialty: pyload.specialty,
        experience: pyload.experience,
        location: pyload.location,
        city: pyload.city,
        state: pyload.state,
        country: pyload.country,
        pinCode: pyload.pinCode || "",
        availability: pyload.availability,
        availabilityTime: pyload.availabilityTime || [],
        consultationFee: pyload.consultationFee || 0,
        languages: pyload.languages || [],
        education: pyload.education,
        isActive: true,
        isVerified: false,

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Doctor created successfully",
        doctor: newDoctor,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        {
          success: false,
          message: error.issues[0].message || "Invalid input data provided",
        },
        { status: 400 }
      );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error &&
          `Failed to create doctor because ${error.message}`,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const pyload = await doctorRegisteredSchema.parseAsync(
      await request.json()
    );
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access. Please log in.",
        },
        { status: 401 }
      );
    } else if (session.user.role == "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to update doctor details.",
        },
        { status: 403 }
      );
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { userId: pyload.userId },
      data: {
        specialty: pyload.specialty,
        experience: pyload.experience,
        location: pyload.location,
        city: pyload.city,
        state: pyload.state,
        country: pyload.country,
        pinCode: pyload.pinCode || "",
        availability: pyload.availability,
        availabilityTime: pyload.availabilityTime || [],
        consultationFee: pyload.consultationFee || 0,
        languages: pyload.languages || [],
        education: pyload.education,
        isActive: true,
        isVerified: false,

        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Doctor updated successfully",
        doctor: updatedDoctor,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        {
          success: false,
          message: error.issues[0].message || "Invalid input data provided",
        },
        { status: 400 }
      );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error &&
          `Failed to update doctor because ${error.message}`,
      },
      { status: 500 }
    );
  }
}
