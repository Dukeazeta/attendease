import { generateKeyPairSync } from "node:crypto";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { DataModel } from "./_generated/dataModel";

function ensureJwtPrivateKeyForDev() {
  if (process.env.JWT_PRIVATE_KEY) {
    return;
  }

  if (process.env.NODE_ENV === "production") {
    return;
  }

  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  process.env.JWT_PRIVATE_KEY = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
}

ensureJwtPrivateKeyForDev();

function getStringParam(params: Record<string, unknown>, key: string) {
  const value = params[key];
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  return undefined;
}

const CustomPassword = Password<DataModel>({
  profile(params) {
    const flow = getStringParam(params as Record<string, unknown>, "flow");
    const email = getStringParam(params as Record<string, unknown>, "email")?.toLowerCase();

    if (!email) {
      throw new Error("Email is required.");
    }

    if (flow === "signUp") {
      const name = getStringParam(params as Record<string, unknown>, "name");
      const matricNumber = getStringParam(
        params as Record<string, unknown>,
        "matricNumber"
      );

      if (!name) {
        throw new Error("Name is required for sign up.");
      }

      if (!matricNumber) {
        throw new Error("Matric number is required for sign up.");
      }

      return {
        email,
        name,
        matricNumber,
      };
    }

    return {
      email,
      name: getStringParam(params as Record<string, unknown>, "name"),
      matricNumber: getStringParam(
        params as Record<string, unknown>,
        "matricNumber"
      ),
    };
  },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword],
});
