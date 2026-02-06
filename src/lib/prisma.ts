import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/http";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (url && authToken) {
        try {
            const libsql = createClient({
                url,
                authToken,
            });
            // @ts-ignore - Adapter type compatibility workaround
            const adapter = new PrismaLibSQL(libsql);
            // @ts-ignore - Adapter property is valid with driverAdapters preview feature
            return new PrismaClient({
                adapter,
                datasources: {
                    db: {
                        url: "file:./dev.db" // Hardcoded for validation; the adapter handles the actual connection
                    }
                }
            });
        } catch (e) {
            console.error("Failed to initialize LibSQL adapter:", e);
            // Fallback to standard client if adapter fails
            return new PrismaClient({
                datasources: {
                    db: {
                        url: "file:./dev.db"
                    }
                }
            });
        }
    }

    return new PrismaClient({
        datasources: {
            db: {
                url: "file:./dev.db"
            }
        }
    });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

