import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Haversine formula to calculate distance between two points in meters
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// List attendances for a session (real-time query!)
export const listBySession = query({
  args: {
    sessionId: v.id("attendanceSessions"),
  },
  handler: async (ctx, args) => {
    const attendances = await ctx.db
      .query("attendances")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Sort by student name
    return attendances.sort((a, b) => a.studentName.localeCompare(b.studentName));
  },
});

// Submit attendance (public - for students)
export const submit = mutation({
  args: {
    sessionId: v.id("attendanceSessions"),
    matricNumber: v.string(),
    studentName: v.string(),
    latitude: v.float64(),
    longitude: v.float64(),
    deviceFingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the session with location
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Check if session is active
    if (!session.isActive) {
      throw new Error("This session has ended");
    }

    // Check if session has expired
    if (session.endTime < Date.now()) {
      throw new Error("This session has expired");
    }

    // Get location for validation
    const location = await ctx.db.get(session.locationId);
    if (!location) {
      throw new Error("Session location not found");
    }

    // Validate device fingerprint
    if (!args.deviceFingerprint) {
      throw new Error("Device verification failed. Please refresh the page and try again.");
    }

    // Check if student has already signed
    const existingByMatric = await ctx.db
      .query("attendances")
      .withIndex("by_session_matric", (q) =>
        q.eq("sessionId", args.sessionId).eq("matricNumber", args.matricNumber.toUpperCase())
      )
      .first();

    if (existingByMatric) {
      throw new Error("You have already signed attendance for this session");
    }

    // Check if device has already signed
    const existingByDevice = await ctx.db
      .query("attendances")
      .withIndex("by_session_device", (q) =>
        q.eq("sessionId", args.sessionId).eq("deviceFingerprint", args.deviceFingerprint)
      )
      .first();

    if (existingByDevice) {
      throw new Error(
        "This device has already been used to sign attendance for this session. Each student must sign from their own device."
      );
    }

    // Verify location
    const distance = calculateDistance(
      args.latitude,
      args.longitude,
      location.latitude,
      location.longitude
    );

    if (distance > location.radiusMeters) {
      throw new Error(
        `You are ${Math.round(distance)}m away. Must be within ${location.radiusMeters}m.`
      );
    }

    // Create attendance record
    return await ctx.db.insert("attendances", {
      sessionId: args.sessionId,
      matricNumber: args.matricNumber.toUpperCase(),
      studentName: args.studentName,
      signedLatitude: args.latitude,
      signedLongitude: args.longitude,
      deviceFingerprint: args.deviceFingerprint,
      isManualEntry: false,
      signedAt: Date.now(),
    });
  },
});

// Add manual attendance entry (for course rep)
export const addManual = mutation({
  args: {
    sessionId: v.id("attendanceSessions"),
    matricNumber: v.string(),
    studentName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get session and verify ownership
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const course = await ctx.db.get(session.courseId);
    if (!course || course.repId !== userId) {
      throw new Error("Unauthorized");
    }

    // Check if student has already signed
    const existing = await ctx.db
      .query("attendances")
      .withIndex("by_session_matric", (q) =>
        q.eq("sessionId", args.sessionId).eq("matricNumber", args.matricNumber.toUpperCase())
      )
      .first();

    if (existing) {
      throw new Error("This student has already signed attendance");
    }

    // Create manual entry with a unique fingerprint
    return await ctx.db.insert("attendances", {
      sessionId: args.sessionId,
      matricNumber: args.matricNumber.toUpperCase(),
      studentName: args.studentName,
      signedLatitude: 0,
      signedLongitude: 0,
      deviceFingerprint: `manual_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      isManualEntry: true,
      signedAt: Date.now(),
    });
  },
});

// Update attendance record
export const update = mutation({
  args: {
    id: v.id("attendances"),
    matricNumber: v.string(),
    studentName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const attendance = await ctx.db.get(args.id);
    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    // Verify ownership through session -> course -> rep
    const session = await ctx.db.get(attendance.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const course = await ctx.db.get(session.courseId);
    if (!course || course.repId !== userId) {
      throw new Error("Unauthorized");
    }

    // Check if new matric number conflicts with existing record
    if (args.matricNumber.toUpperCase() !== attendance.matricNumber) {
      const existing = await ctx.db
        .query("attendances")
        .withIndex("by_session_matric", (q) =>
          q.eq("sessionId", attendance.sessionId).eq("matricNumber", args.matricNumber.toUpperCase())
        )
        .first();

      if (existing) {
        throw new Error("Another student with this matric number has already signed");
      }
    }

    await ctx.db.patch(args.id, {
      matricNumber: args.matricNumber.toUpperCase(),
      studentName: args.studentName,
    });
  },
});

// Delete attendance record
export const remove = mutation({
  args: {
    id: v.id("attendances"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const attendance = await ctx.db.get(args.id);
    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    // Verify ownership
    const session = await ctx.db.get(attendance.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const course = await ctx.db.get(session.courseId);
    if (!course || course.repId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
