import { z } from "zod";

const appointmentSchema = z.object({
  patientId: z.string().cuid2(),
  doctorId: z.string().cuid2(),
  hospitalId: z.string().optional(),
  appointmentDate: z.string().datetime(),
  appointmentTime: z.string(),

  appointmentType: z
    .enum([
      "in_person",
      "online",
      "home_visit",
      "follow_up",
      "emergency",
      "virtual",
    ])
    .default("in_person"),
  appointmentStatus: z
    .enum([
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "no_show",
      "rescheduled",
    ])
    .default("pending"),
  symptoms: z.string().optional(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
});

const appointmentReshuduleSchema = z.object({
  appointmentId: z.string().cuid2(),
  newAppointmentDate: z.string().datetime(),
  newAppointmentTime: z.string().optional(),
  newAppointmentType: z
    .enum([
      "in_person",
      "online",
      "home_visit",
      "follow_up",
      "emergency",
      "virtual",
    ])
    .optional(),
});

export { appointmentSchema, appointmentReshuduleSchema };
