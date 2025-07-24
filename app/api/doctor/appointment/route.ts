import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import {
  appointmentSchema,
  appointmentReshuduleSchema,
} from "@/lib/validations/appointmentValidation";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You do not have permission to access this resource." },
        { status: 403 }
      );
    }

    const appointments = await prisma.appointment.findMany();

    return NextResponse.json(
      {
        success: true,
        message: "Appointments fetched successfully",
        appointments: appointments,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error &&
          `Failed to fetch appointments: ${error.message}`,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await appointmentSchema.parseAsync(await request.json());
    const appointment = await prisma.appointment.create({
      data: {
        patientId: payload.patientId as any,
        doctorId: payload.doctorId as any,
        hospitalId: payload.hospitalId as any,
        appointmentDate: new Date(payload.appointmentDate),
        appointmentTime: payload.appointmentTime,
        appointmentType: payload.appointmentType,
        appointmentStatus: payload.appointmentStatus,
        symptoms: payload.symptoms || null,
        prescription: payload.prescription || null,
        notes: payload.notes || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment created successfully",
        appointment: appointment,
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
          `Failed to create appointment: ${error.message}`,
      },
      { status: 500 }
    );
  }
}

// reshudule the appointment
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await appointmentReshuduleSchema.parseAsync(
      await request.json()
    );
    const appointment = await prisma.appointment.update({
      where: { appointmentId: payload.appointmentId },
      data: {
        appointmentDate: new Date(payload.newAppointmentDate),
        appointmentTime: payload.newAppointmentTime,
        appointmentStatus: "rescheduled", // Update status to rescheduled
        appointmentType: payload.newAppointmentType || undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment updated successfully",
        appointment: appointment,
      },
      { status: 200 }
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
          `Failed to update appointment: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
