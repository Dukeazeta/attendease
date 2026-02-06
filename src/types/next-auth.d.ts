import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            matricNumber?: string;
        } & DefaultSession["user"];
    }
}
