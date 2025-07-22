import { z } from "zod";

const doctorRegisteredSchema = z.object({
  userId: z.string("User ID is required"),
  specialty: z
    .string("Specialty is required")
    .min(2, "Specialty must be at least 2 characters"),
  experience: z
    .number("Experience is required")
    .int()
    .min(0, "Experience must be a non-negative integer"),
  location: z
    .string("Location is required")
    .min(2, "Location must be at least 2 characters"),
  city: z
    .string("City is required")
    .min(2, "City must be at least 2 characters"),
  state: z
    .string("State is required")
    .min(2, "State must be at least 2 characters"),
  country: z
    .string("Country is required")
    .min(2, "Country must be at least 2 characters"),
  pinCode: z
    .string("Pin code is required")
    .min(5, "Pin code must be at least 5 characters")
    .max(10, "Pin code must be at most 10 characters")
    .optional(),

  availability: z.array(
    z
      .string()
      .refine(
        (val: string) =>
          [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ].includes(val),
        {
          message:
            "Availability must be one of the following: monday, tuesday, wednesday, thursday, friday, saturday, sunday",
        }
      )
  ),

  availabilityTime: z
    .array(z.string("Availability time is required"))
    .optional(),
  consultationFee: z
    .number("Consultation fee is required")
    .int()
    .min(0, "Consultation fee must be a non-negative integer")
    .optional(),
  languages: z
    .array(
      z
        .string("Language is required")
        .min(2, "Language must be at least 2 characters")
    )
    .optional(),
  education: z
    .string("Education is required")
    .min(2, "Education must be at least 2 characters"),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export { doctorRegisteredSchema };
