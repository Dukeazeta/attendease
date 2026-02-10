import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const isEdge = process.env.NEXT_RUNTIME === "edge";
const isFileScheme = process.env.DATABASE_URL?.startsWith("file:");

// We cannot use file: scheme in the Edge Runtime (middleware).
// Since middleware often imports auth which imports db, we must guard this.
const client = (!isEdge || !isFileScheme)
    ? createClient({
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_AUTH_TOKEN,
    })
    : null;

export const db = client ? drizzle(client, { schema }) : {} as any;
