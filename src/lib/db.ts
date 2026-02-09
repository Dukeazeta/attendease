export type AppUser = {
  id: string;
  email: string;
  name: string;
  matricNumber?: string;
  password?: string;
  createdAt: Date;
};

export type Course = {
  id: string;
  repId: string;
  courseCode: string;
  courseTitle: string;
  createdAt: Date;
};

export type Location = {
  id: string;
  name: string;
  building: string | null;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  createdAt: Date;
};

export type AttendanceSession = {
  id: string;
  courseId: string;
  locationId: string;
  shareCode: string;
  isActive: boolean;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
};

export type Attendance = {
  id: string;
  sessionId: string;
  matricNumber: string;
  studentName: string;
  signedLatitude: number;
  signedLongitude: number;
  deviceFingerprint: string;
  isManualEntry: boolean;
  signedAt: Date;
};

type Store = {
  users: AppUser[];
  courses: Course[];
  locations: Location[];
  sessions: AttendanceSession[];
  attendances: Attendance[];
};

const globalStore = globalThis as unknown as { __attendeaseStore?: Store };

const store: Store =
  globalStore.__attendeaseStore ??
  (globalStore.__attendeaseStore = {
    users: [],
    courses: [],
    locations: [],
    sessions: [],
    attendances: [],
  });

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const descByCreatedAt = <T extends { createdAt: Date }>(items: T[]) =>
  [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

const ascByName = <T extends { name: string }>(items: T[]) =>
  [...items].sort((a, b) => a.name.localeCompare(b.name));

const resolveCourse = (courseId: string) => store.courses.find((c) => c.id === courseId) ?? null;
const resolveLocation = (locationId: string) =>
  store.locations.find((l) => l.id === locationId) ?? null;
const resolveSessionAttendances = (sessionId: string) =>
  store.attendances.filter((a) => a.sessionId === sessionId);

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
      const where = args?.where;
      if (!where) return null;

      if (Array.isArray(where.OR)) {
        const orConditions = where.OR as Array<Record<string, unknown>>;
        return (
          store.users.find((u) =>
            orConditions.some((cond) =>
              Object.entries(cond).every(([k, v]) => (u as any)[k] === v)
            )
          ) ?? null
        );
      }

      return (
        store.users.find((u) =>
          Object.entries(where).every(([k, v]) => (u as any)[k] === v)
        ) ?? null
      );
    },

    async create(args?: { data?: Partial<AppUser> }) {
      const data = args?.data ?? {};
      const user: AppUser = {
        id: makeId(),
        email: String(data.email ?? ""),
        name: String(data.name ?? ""),
        matricNumber: data.matricNumber ? String(data.matricNumber) : undefined,
        password: data.password ? String(data.password) : undefined,
        createdAt: new Date(),
      };

      store.users.push(user);
      return user;
    },

    async count() {
      return store.users.length;
    },
  },

  course: {
    async findMany(args?: any) {
      let courses = [...store.courses];

      if (args?.where?.repId) {
        courses = courses.filter((c) => c.repId === args.where.repId);
      }

      if (args?.orderBy?.createdAt === "desc") {
        courses = descByCreatedAt(courses);
      }

      return courses.map((course) => {
        const sessions = store.sessions.filter((s) => s.courseId === course.id);
        const out: any = { ...course };

        if (args?.include?.sessions) {
          out.sessions = sessions
            .filter((s) => (args.include.sessions.where?.isActive ? s.isActive : true))
            .map((s) => ({
              ...s,
              location: args.include.sessions.include?.location
                ? resolveLocation(s.locationId)
                : undefined,
              _count: args.include.sessions.include?._count
                ? { attendances: resolveSessionAttendances(s.id).length }
                : undefined,
            }));
        }

        if (args?.include?._count?.select?.sessions) {
          out._count = { sessions: sessions.length };
        }

        return out;
      });
    },

    async findFirst(args?: any) {
      const where = args?.where ?? {};
      return (
        store.courses.find((c) =>
          Object.entries(where).every(([k, v]) => (c as any)[k] === v)
        ) ?? null
      );
    },

    async create(args?: { data?: any }) {
      const data = args?.data ?? {};
      const course: Course = {
        id: makeId(),
        repId: String(data.repId ?? ""),
        courseCode: String(data.courseCode ?? ""),
        courseTitle: String(data.courseTitle ?? ""),
        createdAt: new Date(),
      };

      store.courses.push(course);
      return course;
    },

    async delete(args?: { where?: any }) {
      const where = args?.where ?? {};
      const index = store.courses.findIndex((c) =>
        Object.entries(where).every(([k, v]) => (c as any)[k] === v)
      );

      if (index === -1) throw new Error("Course not found");
      const [deleted] = store.courses.splice(index, 1);
      return deleted;
    },
  },

  location: {
    async findMany(args?: any) {
      let locations = [...store.locations];

      if (args?.orderBy?.name === "asc") {
        locations = ascByName(locations);
      } else if (args?.orderBy?.createdAt === "desc") {
        locations = descByCreatedAt(locations);
      }

      return locations;
    },

    async create(args?: { data?: any }) {
      const data = args?.data ?? {};
      const location: Location = {
        id: makeId(),
        name: String(data.name ?? ""),
        building: data.building ? String(data.building) : null,
        latitude: Number(data.latitude ?? 0),
        longitude: Number(data.longitude ?? 0),
        radiusMeters: Number(data.radiusMeters ?? 100),
        createdAt: new Date(),
      };

      store.locations.push(location);
      return location;
    },

    async delete(args?: { where?: any }) {
      const where = args?.where ?? {};
      const index = store.locations.findIndex((l) =>
        Object.entries(where).every(([k, v]) => (l as any)[k] === v)
      );

      if (index === -1) throw new Error("Location not found");
      const [deleted] = store.locations.splice(index, 1);
      return deleted;
    },
  },

  attendanceSession: {
    async findMany(args?: any) {
      let sessions = [...store.sessions];

      if (args?.where?.isActive !== undefined) {
        sessions = sessions.filter((s) => s.isActive === args.where.isActive);
      }

      if (args?.where?.course?.repId) {
        sessions = sessions.filter(
          (s) => resolveCourse(s.courseId)?.repId === args.where.course.repId
        );
      }

      if (args?.orderBy?.createdAt === "desc") {
        sessions = descByCreatedAt(sessions);
      }

      return sessions.map((s) => {
        const out: any = { ...s };
        if (args?.include?.course) out.course = resolveCourse(s.courseId);
        if (args?.include?.location) out.location = resolveLocation(s.locationId);
        if (args?.include?._count?.select?.attendances) {
          out._count = { attendances: resolveSessionAttendances(s.id).length };
        }
        return out;
      });
    },

    async findUnique(args?: any) {
      const where = args?.where ?? {};
      const session =
        store.sessions.find((s) =>
          Object.entries(where).every(([k, v]) => (s as any)[k] === v)
        ) ?? null;

      if (!session) return null;

      const out: any = { ...session };
      if (args?.include?.course) out.course = resolveCourse(session.courseId);
      if (args?.include?.location) out.location = resolveLocation(session.locationId);
      if (args?.include?.attendances) {
        let attends = resolveSessionAttendances(session.id);
        if (args.include.attendances.orderBy?.signedAt === "desc") {
          attends = [...attends].sort((a, b) => b.signedAt.getTime() - a.signedAt.getTime());
        }
        out.attendances = attends;
      }

      return out;
    },

    async create(args?: { data?: any }) {
      const data = args?.data ?? {};
      const session: AttendanceSession = {
        id: makeId(),
        courseId: String(data.courseId ?? ""),
        locationId: String(data.locationId ?? ""),
        shareCode: String(data.shareCode ?? ""),
        isActive: Boolean(data.isActive ?? true),
        startTime: new Date(),
        endTime: data.endTime ? new Date(data.endTime) : new Date(),
        createdAt: new Date(),
      };

      store.sessions.push(session);
      return session;
    },

    async update(args?: { where?: any; data?: any }) {
      const where = args?.where ?? {};
      const data = args?.data ?? {};
      const session = store.sessions.find((s) =>
        Object.entries(where).every(([k, v]) => (s as any)[k] === v)
      );

      if (!session) throw new Error("Session not found");
      Object.assign(session, data);
      return session;
    },
  },

  attendance: {
    async findUnique(args?: any) {
      const where = args?.where ?? {};
      let attendance: Attendance | null = null;

      if (where.sessionId_matricNumber) {
        const { sessionId, matricNumber } = where.sessionId_matricNumber;
        attendance =
          store.attendances.find(
            (a) => a.sessionId === sessionId && a.matricNumber === matricNumber
          ) ?? null;
      } else {
        attendance =
          store.attendances.find((a) =>
            Object.entries(where).every(([k, v]) => (a as any)[k] === v)
          ) ?? null;
      }

      if (!attendance) return null;
      if (!args?.include?.session) return attendance;

      const session = store.sessions.find((s) => s.id === attendance.sessionId) ?? null;
      const withSession: any = { ...attendance, session };
      if (args.include.session.include?.course && session) {
        withSession.session = { ...session, course: resolveCourse(session.courseId) };
      }

      return withSession;
    },

    async findFirst(args?: any) {
      const where = args?.where ?? {};
      return (
        store.attendances.find((a) =>
          Object.entries(where).every(([k, v]) => (a as any)[k] === v)
        ) ?? null
      );
    },

    async create(args?: { data?: any }) {
      const data = args?.data ?? {};
      const attendance: Attendance = {
        id: makeId(),
        sessionId: String(data.sessionId ?? ""),
        matricNumber: String(data.matricNumber ?? "").toUpperCase(),
        studentName: String(data.studentName ?? ""),
        signedLatitude: Number(data.signedLatitude ?? 0),
        signedLongitude: Number(data.signedLongitude ?? 0),
        deviceFingerprint: String(data.deviceFingerprint ?? ""),
        isManualEntry: Boolean(data.isManualEntry ?? false),
        signedAt: new Date(),
      };

      store.attendances.push(attendance);
      return attendance;
    },

    async update(args?: { where?: any; data?: any }) {
      const where = args?.where ?? {};
      const data = args?.data ?? {};
      const attendance = store.attendances.find((a) =>
        Object.entries(where).every(([k, v]) => (a as any)[k] === v)
      );

      if (!attendance) throw new Error("Attendance not found");
      Object.assign(attendance, data);
      return attendance;
    },

    async delete(args?: { where?: any }) {
      const where = args?.where ?? {};
      const index = store.attendances.findIndex((a) =>
        Object.entries(where).every(([k, v]) => (a as any)[k] === v)
      );

      if (index === -1) throw new Error("Attendance not found");
      const [deleted] = store.attendances.splice(index, 1);
      return deleted;
    },
  },
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
