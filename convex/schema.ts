import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.optional(v.string()),
    name: v.optional(v.string()),
    email: v.string(),
    password: v.optional(v.string()),
    matricNumber: v.optional(v.string()),
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_matricNumber", ["matricNumber"])
    .index("by_externalId", ["externalId"]),

  locations: defineTable({
    externalId: v.optional(v.string()),
    name: v.string(),
    building: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    radiusMeters: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_name", ["name"]),

  courses: defineTable({
    externalId: v.optional(v.string()),
    courseCode: v.string(),
    courseTitle: v.string(),
    repId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_repId", ["repId"])
    .index("by_courseCode_and_repId", ["courseCode", "repId"]),

  attendanceSessions: defineTable({
    externalId: v.optional(v.string()),
    courseId: v.id("courses"),
    locationId: v.id("locations"),
    shareCode: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_shareCode", ["shareCode"])
    .index("by_courseId", ["courseId"])
    .index("by_locationId", ["locationId"]),

  attendances: defineTable({
    externalId: v.optional(v.string()),
    sessionId: v.id("attendanceSessions"),
    matricNumber: v.string(),
    studentName: v.string(),
    signedLatitude: v.number(),
    signedLongitude: v.number(),
    deviceFingerprint: v.string(),
    isManualEntry: v.boolean(),
    signedAt: v.number(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_sessionId", ["sessionId"])
    .index("by_sessionId_and_matricNumber", ["sessionId", "matricNumber"])
    .index("by_sessionId_and_deviceFingerprint", ["sessionId", "deviceFingerprint"]),
});
