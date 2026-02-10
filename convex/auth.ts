import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { DataModel } from "./_generated/dataModel";

const DEV_JWT_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCWReE2CIAR1TCt
yhe5kUpBG6uW4MKPXNBKtjYTX6YfSNq8l5vYqwHbLaFNbbB8R7i3KC0ECMqXySb5
q7gZ7Jkn9lAfthqcChZDQnJ6IOF1mKFRy3EakwmNgOXpnNmJir7Kn3W8SMEtXlod
kk2lrTzmBVVP3+2Gdq+7gwKPApK34VpWR4QIGPtT/hXK4mQbg1CtNSSSl67YPtcI
f5h/IcanMYuzhCleiDxCfb6XV3yVBO5G9YsdX7obLL0azESgGI1DIIaYf05zVoio
EGSmjBwBqdRwsgm3dDe58XrsXuibyktHfYbwGDKiIAErsWPwV2VaspLooO26YJz5
eIH40HPpAgMBAAECggEAI2KBDYAi6BATTljwDToxCfPCC90Q80EfqvgM87LqIyO8
nfv1LqfV4A52lQznKdyZmkdTkkefrO4ox1GwICqeRdKyO0VeLrARXfUfj7J+ZHp0
QhZto5xL+44GlWPhtYl+M6goyRU4p7436g6xSfnpBSDsXcqU27zG1Jic2Z/5fGKv
tQNVgQihq3B+R94rCaDuPuySwxLiz8vm+hbwxUxQHIkMbbYgK5UD1a5EK/ncRvY2
CDccv1aEhNtmpDEriDUBKSvhvehZDa/KtKPAm7Dj6wH4jPYyjNaX2KitRxFf8YPu
BRQuzPx7kpkXrii7nWjMHvKzdSJbDvZ6hSpk1iH4gQKBgQDNAOIKXWte33oRNVyT
gz1UmPTZO9NRwx8Vh6rR0eToM4r87CIJrzttJfdYTXAaSiAvfsjTvjSOeKJJbBVG
qaEKlpckjthJkxAUvS6IsrU4XTNCk0L6zaRP6GnebW25CyD3G0wRYblxLP85Mztg
dA4rpk3+5dREvltAoZD1HisFnQKBgQC7p6B9cWC5+3J4s08W72YaVvVI0sIkgMYy
NVpebZWyHLSb8BVRsEaUznS33nC8Y81OIt0j0pLBAwXysaM4/xWL/nfzD7jzyfc3
uc3/h0G6b/HMrHvweNsbuJJDL3hvWeuPNmAb9ObGhAwKVq3bChTHccqX3L9iwiIi
a7rLFkDbvQKBgQCUo5VBaqbVLTf2jjhHhJrNYfH2KFh6Kf25wJpsc8GDUwvtgtDT
MMjnxOVokw07Io/foA/A52J4AqO4lLOAfrGTWcjQ6vmLryOzxc+dseWPrpPiK6Ae
9Uez4JISgklSJ+2I/bPTzoWEt9l+AdWFg+BaacSXktCr31GOtRbDg1IySQKBgGqy
WddZcsTsil7EnTCOOAC79sVMSGTW71o26cYNCvN1zN9pN8X1s3wCk2zERldna6GE
wzYOEbE61dPzWroal5a8vljuVJwQ9saxl8Y1kpK9+b8FR4coQHTXkhovUIwHlZ8d
LLJYoiq3g90RAdMsPTpVofqM4ij19tCZbmDwqzoFAoGAAuxuBZg7tbKblL5vfsfv
usZOUE13OJpYpVA9KpqPU7u1V86s6m87XEKeYKpPKtCwEWbcJiKbM1RxusbIwrPO
s4aDXFk8FYJBqS8Tx3Yh1BkX2yBNF5aSMxoJEcC3/b/BGv1WCUjzZ5SkcZm923jY
s8vUGETChwvZCuItvRWordY=
-----END PRIVATE KEY-----`;

function ensureJwtPrivateKeyForDev() {
  if (process.env.JWT_PRIVATE_KEY) {
    return;
  }

  if (process.env.NODE_ENV === "production") {
    return;
  }

  process.env.JWT_PRIVATE_KEY = DEV_JWT_PRIVATE_KEY;
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
