export type AppUser = {
    id: string;
    email: string;
    name: string;
    matricNumber: string;
    password?: string;
};

const store = {
    users: [] as AppUser[],
};

const makeId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

export const db = {
    user: {
        async findUnique(args?: any) {
            const where = args?.where;
            if (!where) return null;
            if (where.email) return store.users.find((u) => u.email === where.email) ?? null;
            if (where.id) return store.users.find((u) => u.id === where.id) ?? null;
            return null;
        },
        async findFirst(args?: any) {
            const email = args?.where?.email;
            if (email) return store.users.find((u) => u.email === email) ?? null;
            return null;
        },
        async create(args?: { data?: Omit<AppUser, "id"> }) {
            const data = args?.data;
            if (!data) {
                return { id: makeId(), email: "", name: "", matricNumber: "" } as AppUser;
            }
            const user: AppUser = { id: makeId(), ...data };
            store.users.push(user);
            return user;
        },
        async count() {
            return store.users.length;
        },
    },

    course: {
        async findMany(_args?: unknown) {
            return [] as any[];
        },
        async findFirst(_args?: unknown) {
            return null as any;
        },
        async create(args?: { data?: Record<string, unknown> }) {
            return { id: makeId(), ...(args?.data ?? {}) } as any;
        },
        async delete(args?: { where?: Record<string, unknown> }) {
            return { ...(args?.where ?? {}) } as any;
        },
    },

    location: {
        async findMany(_args?: unknown) {
            return [] as any[];
        },
        async create(args?: { data?: Record<string, unknown> }) {
            return { id: makeId(), ...(args?.data ?? {}) } as any;
        },
        async delete(args?: { where?: Record<string, unknown> }) {
            return { ...(args?.where ?? {}) } as any;
        },
    },

    attendanceSession: {
        async findMany(_args?: unknown) {
            return [] as any[];
        },
        async findUnique(_args?: unknown) {
            return null as any;
        },
        async create(args?: { data?: Record<string, unknown> }) {
            return { id: makeId(), ...(args?.data ?? {}) } as any;
        },
        async update(args?: { where?: Record<string, unknown>; data?: Record<string, unknown> }) {
            return { ...(args?.where ?? {}), ...(args?.data ?? {}) } as any;
        },
    },

    attendance: {
        async findUnique(_args?: unknown) {
            return null as any;
        },
        async findFirst(_args?: unknown) {
            return null as any;
        },
        async create(args?: { data?: Record<string, unknown> }) {
            return { id: makeId(), ...(args?.data ?? {}) } as any;
        },
        async update(args?: { where?: Record<string, unknown>; data?: Record<string, unknown> }) {
            return { ...(args?.where ?? {}), ...(args?.data ?? {}) } as any;
        },
        async delete(args?: { where?: Record<string, unknown> }) {
            return { ...(args?.where ?? {}) } as any;
        },
    },
};

export default db;
