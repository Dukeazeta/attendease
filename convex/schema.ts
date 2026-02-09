import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Convex Auth tables (users, authSessions, authAccounts, authRefreshTokens, authVerificationCodes, authVerifiers, authRateLimits)
  ...authTables,

  // Override users table with custom fields
  users: defineTable({
    // Standard Convex Auth fields
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Custom field for AttendEase
    matricNumber: v.optional(v.string()),
  })
    .index("email", ["email"])
    .index("matricNumber", ["matricNumber"]),

  // Pre-stored class venues
  locations: defineTable({
    name: v.string(), // e.g., "LT1", "Room 204"
    building: v.optional(v.string()), // e.g., "Faculty of Science"
    latitude: v.float64(),
    longitude: v.float64(),
    radiusMeters: v.number(), // default 100
    createdBy: v.id("users"),
  }).index("by_creator", ["createdBy"]),

  // Courses managed by a rep
  courses: defineTable({
    courseCode: v.string(), // e.g., "CSC301"
    courseTitle: v.string(), // e.g., "Computer Architecture"
    repId: v.id("users"),
  })
    .index("by_rep", ["repId"])
    .index("by_code_and_rep", ["courseCode", "repId"]),

  // Attendance sessions
  attendanceSessions: defineTable({
    courseId: v.id("courses"),
    locationId: v.id("locations"),
    shareCode: v.string(), // 6-char unique code for sharing
    startTime: v.number(), // timestamp
    endTime: v.number(), // timestamp
    isActive: v.boolean(),
  })
    .index("by_shareCode", ["shareCode"])
    .index("by_course", ["courseId"])
    .index("by_active", ["isActive"])
    .index("by_course_active", ["courseId", "isActive"]),

  // Individual attendance records
  attendances: defineTable({
    sessionId: v.id("attendanceSessions"),
    matricNumber: v.string(),
    studentName: v.string(),
    signedLatitude: v.float64(),
    signedLongitude: v.float64(),
    deviceFingerprint: v.string(),
    isManualEntry: v.boolean(),
    signedAt: v.number(), // timestamp
  })
    .index("by_session", ["sessionId"])
    .index("by_session_matric", ["sessionId", "matricNumber"])
    .index("by_session_device", ["sessionId", "deviceFingerprint"]),
});
