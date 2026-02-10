import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

// Auth Tables (NextAuth)

// Auth Tables (NextAuth)
export const users = sqliteTable("user", {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
    image: text("image"),
    // Custom field for AttendEase
    matricNumber: text("matricNumber").unique(),
});

export const accounts = sqliteTable("account", {
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
}, (table) => ({
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}));

export const authSessions = sqliteTable("session", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verificationToken", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.identifier, table.token] }),
}));

// AttendEase Domain Tables

// Pre-stored class venues
export const locations = sqliteTable("locations", {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(), // e.g., "LT1", "Room 204"
    building: text("building"), // e.g., "Faculty of Science"
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    radiusMeters: integer("radiusMeters").notNull().default(100),
    createdBy: text("createdBy")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

// Courses managed by a rep
export const courses = sqliteTable("courses", {
    id: text("id").notNull().primaryKey(),
    courseCode: text("courseCode").notNull(), // e.g., "CSC301"
    courseTitle: text("courseTitle").notNull(), // e.g., "Computer Architecture"
    repId: text("repId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

// Attendance sessions
export const attendanceSessions = sqliteTable("attendance_sessions", {
    id: text("id").notNull().primaryKey(),
    courseId: text("courseId")
        .notNull()
        .references(() => courses.id, { onDelete: "cascade" }),
    locationId: text("locationId")
        .notNull()
        .references(() => locations.id, { onDelete: "cascade" }),
    shareCode: text("shareCode").notNull().unique(), // 6-char unique code for sharing
    startTime: integer("startTime", { mode: "timestamp_ms" }).notNull(),
    endTime: integer("endTime", { mode: "timestamp_ms" }).notNull(),
    isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

// Individual attendance records
export const attendances = sqliteTable("attendances", {
    id: text("id").notNull().primaryKey(),
    sessionId: text("sessionId")
        .notNull()
        .references(() => attendanceSessions.id, { onDelete: "cascade" }),
    matricNumber: text("matricNumber").notNull(),
    studentName: text("studentName").notNull(),
    signedLatitude: real("signedLatitude").notNull(),
    signedLongitude: real("signedLongitude").notNull(),
    deviceFingerprint: text("deviceFingerprint").notNull(),
    isManualEntry: integer("isManualEntry", { mode: "boolean" }).notNull().default(false),
    signedAt: integer("signedAt", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(authSessions),
    accounts: many(accounts),
    courses: many(courses),
    locations: many(locations),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
    rep: one(users, {
        fields: [courses.repId],
        references: [users.id],
    }),
    sessions: many(attendanceSessions),
}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
    creator: one(users, {
        fields: [locations.createdBy],
        references: [users.id],
    }),
    sessions: many(attendanceSessions),
}));

export const attendanceSessionsRelations = relations(attendanceSessions, ({ one, many }) => ({
    course: one(courses, {
        fields: [attendanceSessions.courseId],
        references: [courses.id],
    }),
    location: one(locations, {
        fields: [attendanceSessions.locationId],
        references: [locations.id],
    }),
    attendances: many(attendances),
}));

export const attendancesRelations = relations(attendances, ({ one }) => ({
    session: one(attendanceSessions, {
        fields: [attendances.sessionId],
        references: [attendanceSessions.id],
    }),
}));
