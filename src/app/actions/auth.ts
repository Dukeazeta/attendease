"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/password";

type BootstrapLegacyPasswordArgs = {
  email: string;
  matricNumber: string;
  newPassword: string;
};

export async function bootstrapLegacyPassword(args: BootstrapLegacyPasswordArgs) {
  const email = args.email.trim().toLowerCase();
  const matricNumber = args.matricNumber.trim().toUpperCase();
  const newPassword = args.newPassword;

  if (!email || !matricNumber || !newPassword) {
    throw new Error("Email, matric number, and password are required.");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !user.matricNumber) {
    throw new Error("We could not verify these account details.");
  }

  if (user.passwordHash) {
    throw new Error("Password is already configured for this account.");
  }

  if (user.matricNumber.toUpperCase() !== matricNumber) {
    throw new Error("We could not verify these account details.");
  }

  await db
    .update(users)
    .set({ passwordHash: hashPassword(newPassword) })
    .where(eq(users.id, user.id));

  return { success: true as const };
}
