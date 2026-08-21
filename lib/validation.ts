import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Add meg az e-mail-címedet.")
  .email("Érvényes e-mail-címet adj meg.")
  .max(254, "Az e-mail-cím túl hosszú.")
  .transform((value) => value.toLowerCase());

const newPasswordSchema = z
  .string()
  .min(1, "Add meg a jelszót.")
  .min(8, "A jelszó legalább 8 karakter legyen.")
  .max(72, "A jelszó legfeljebb 72 karakter lehet.");

export const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Add meg a nevedet.")
    .min(2, "A név legalább 2 karakter legyen.")
    .max(80, "A név legfeljebb 80 karakter lehet."),
  email: emailSchema,
  password: newPasswordSchema,
  consent: z.boolean().refine((value) => value, {
    message: "A regisztrációhoz el kell fogadnod az adatkezelési tájékoztatót és a felhasználási feltételeket."
  }),
  website: z.string().max(0, "Érvénytelen kérés.").optional().default("")
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Add meg a jelszavadat.").max(72, "A jelszó túl hosszú.")
});

export const resetPasswordSchema = z.object({
  email: emailSchema
});

export const updatePasswordSchema = z
  .object({
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, "Írd be újra a jelszót.")
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "A két jelszó nem egyezik.",
    path: ["confirmPassword"]
  });

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const flattened = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(flattened).flatMap(([field, messages]) => {
      const message = messages?.[0];
      return message ? [[field, message]] : [];
    })
  );
}

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) => !value || /^https?:\/\//i.test(value) || /^[\w.-]+\.[a-z]{2,}/i.test(value),
    "Érvényes webcímet adj meg."
  );

export const profileSchema = z.object({
  slug: z
    .string()
    .min(3, "A profilcím legalább 3 karakter legyen.")
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Csak kisbetű, szám és kötőjel használható."),
  display_name: z.string().trim().min(2).max(80),
  job_title: z.string().trim().max(100),
  company: z.string().trim().max(100),
  bio: z.string().trim().max(420),
  public_email: z.union([z.literal(""), z.string().email()]),
  phone: z.string().trim().max(40),
  website: optionalUrl,
  address: z.string().trim().max(180),
  avatar_url: z.union([z.null(), z.string().url()]),
  theme: z.enum(["midnight", "ivory", "forest", "plum"]),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  is_public: z.boolean(),
  social_links: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        platform: z.enum([
          "linkedin",
          "facebook",
          "instagram",
          "youtube",
          "tiktok",
          "x",
          "github",
          "custom"
        ]),
        label: z.string().trim().min(1).max(40),
        url: z.string().url(),
        sort_order: z.number().int().min(0).max(20),
        enabled: z.boolean()
      })
    )
    .max(10)
});

export const analyticsEventSchema = z.object({
  profileId: z.string().uuid(),
  eventType: z.enum(["view", "save", "phone", "email", "website", "social", "share"]),
  linkKey: z.string().max(100).optional().default("")
});
