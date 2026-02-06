import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
    }

    // Prisma 7 adapter factory expects libsql config directly.
    const adapter = new PrismaLibSql({
        url,
        authToken,
    });
    // @ts-ignore - Adapter property is valid with driverAdapters preview feature
    return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
