import { fetchMutation, fetchQuery } from "convex/nextjs";
import { makeFunctionReference } from "convex/server";

type ConvexUser = {
  _id: string;
  externalId?: string;
  name?: string;
  email: string;
  password?: string;
  matricNumber?: string;
};

const getUserByEmailRef = makeFunctionReference<"query">("users:getUserByEmail");
const getUserByEmailOrMatricNumberRef = makeFunctionReference<"query">(
  "users:getUserByEmailOrMatricNumber"
);
const createUserRef = makeFunctionReference<"mutation">("users:createUser");

const shouldUseConvex = process.env.USE_CONVEX_PRIMARY === "true";

function assertConvexEnv() {
  if (!shouldUseConvex) {
    return;
  }

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL must be set when USE_CONVEX_PRIMARY=true");
  }
}

export async function getConvexUserByEmail(email: string): Promise<ConvexUser | null> {
  assertConvexEnv();

  const user = (await fetchQuery(getUserByEmailRef, { email })) as ConvexUser | null;
  return user;
}

export async function getConvexUserByEmailOrMatricNumber(
  email: string,
  matricNumber?: string
): Promise<ConvexUser | null> {
  assertConvexEnv();

  const user = (await fetchQuery(getUserByEmailOrMatricNumberRef, {
    email,
    matricNumber,
  })) as ConvexUser | null;

  return user;
}

export async function createConvexUser(data: {
  name: string;
  email: string;
  password: string;
  matricNumber?: string;
}) {
  assertConvexEnv();

  const user = (await fetchMutation(createUserRef, data)) as ConvexUser | null;
  return user;
}

export function convexEnabled() {
  return shouldUseConvex;
}
