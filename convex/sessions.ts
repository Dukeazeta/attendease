import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate a random 6-character share code
function generateShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing chars like O,0,1,I
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// List all sessions for the authenticated user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get all courses for this user
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_rep", (q) => q.eq("repId", userId))
      .collect();

    const courseIds = courses.map((c) => c._id);

    // Get all sessions for these courses
    const allSessions = await Promise.all(
      courseIds.map((courseId) =>
        ctx.db
          .query("attendanceSessions")
          .withIndex("by_course", (q) => q.eq("courseId", courseId))
          .collect()
      )
    );

    const sessions = allSessions.flat();

    // Enrich with course, location, and attendance count
    const enrichedSessions = await Promise.all(
      sessions.map(async (session) => {
        const course = courses.find((c) => c._id === session.courseId);
        const location = await ctx.db.get(session.locationId);
        const attendances = await ctx.db
          .query("attendances")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .collect();

        return {
          ...session,
          course: course
            ? { courseCode: course.courseCode, courseTitle: course.courseTitle }
            : null,
          location: location
            ? { name: location.name, building: location.building }
            : null,
          attendanceCount: attendances.length,
        };
      })
    );

    // Sort by start time (newest first)
    return enrichedSessions.sort((a, b) => b.startTime - a.startTime);
  },
});

// Get active sessions for the authenticated user
export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get all courses for this user
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_rep", (q) => q.eq("repId", userId))
      .collect();

    const courseIds = courses.map((c) => c._id);

    // Get active sessions for these courses
    const allSessions = await Promise.all(
      courseIds.map((courseId) =>
        ctx.db
          .query("attendanceSessions")
          .withIndex("by_course_active", (q) =>
            q.eq("courseId", courseId).eq("isActive", true)
          )
          .collect()
      )
    );

    const sessions = allSessions.flat();

    // Enrich with course, location, and attendance count
    const enrichedSessions = await Promise.all(
      sessions.map(async (session) => {
        const course = courses.find((c) => c._id === session.courseId);
        const location = await ctx.db.get(session.locationId);
        const attendances = await ctx.db
          .query("attendances")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .collect();

        return {
          ...session,
          course: course
            ? { courseCode: course.courseCode, courseTitle: course.courseTitle }
            : null,
          location: location
            ? { name: location.name, building: location.building }
            : null,
          attendanceCount: attendances.length,
        };
      })
    );

    return enrichedSessions.sort((a, b) => b.startTime - a.startTime);
  },
});

// Get a session by ID with full details
export const get = query({
  args: {
    id: v.id("attendanceSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.id);
    if (!session) {
      return null;
    }

    const course = await ctx.db.get(session.courseId);
    const location = await ctx.db.get(session.locationId);
    const attendances = await ctx.db
      .query("attendances")
      .withIndex("by_session", (q) => q.eq("sessionId", args.id))
      .collect();

    // Sort attendances by student name
    const sortedAttendances = attendances.sort((a, b) =>
      a.studentName.localeCompare(b.studentName)
    );

    return {
      ...session,
      course: course
        ? { courseCode: course.courseCode, courseTitle: course.courseTitle }
        : null,
      location: location
        ? {
            name: location.name,
            building: location.building,
            latitude: location.latitude,
            longitude: location.longitude,
            radiusMeters: location.radiusMeters,
          }
        : null,
      attendances: sortedAttendances,
    };
  },
});

// Get a session by share code (public - for students)
export const getByShareCode = query({
  args: {
    shareCode: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("attendanceSessions")
      .withIndex("by_shareCode", (q) => q.eq("shareCode", args.shareCode.toUpperCase()))
      .first();

    if (!session) {
      return null;
    }

    const course = await ctx.db.get(session.courseId);
    const location = await ctx.db.get(session.locationId);

    return {
      id: session._id,
      isActive: session.isActive,
      endTime: session.endTime,
      course: course
        ? { courseCode: course.courseCode, courseTitle: course.courseTitle }
        : null,
      location: location
        ? {
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
            radiusMeters: location.radiusMeters,
          }
        : null,
    };
  },
});

// Create a new session
export const create = mutation({
  args: {
    courseId: v.id("courses"),
    locationId: v.id("locations"),
    durationMinutes: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify course belongs to user
    const course = await ctx.db.get(args.courseId);
    if (!course || course.repId !== userId) {
      throw new Error("Course not found or unauthorized");
    }

    // Generate unique share code
    let shareCode = generateShareCode();
    let existing = await ctx.db
      .query("attendanceSessions")
      .withIndex("by_shareCode", (q) => q.eq("shareCode", shareCode))
      .first();

    // Retry if code already exists (rare)
    while (existing) {
      shareCode = generateShareCode();
      existing = await ctx.db
        .query("attendanceSessions")
        .withIndex("by_shareCode", (q) => q.eq("shareCode", shareCode))
        .first();
    }

    const now = Date.now();
    const endTime = now + args.durationMinutes * 60 * 1000;

    return await ctx.db.insert("attendanceSessions", {
      courseId: args.courseId,
      locationId: args.locationId,
      shareCode,
      startTime: now,
      endTime,
      isActive: true,
    });
  },
});

// End a session
export const endSession = mutation({
  args: {
    id: v.id("attendanceSessions"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const session = await ctx.db.get(args.id);
    if (!session) {
      throw new Error("Session not found");
    }

    // Verify session belongs to user's course
    const course = await ctx.db.get(session.courseId);
    if (!course || course.repId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, { isActive: false });
  },
});
