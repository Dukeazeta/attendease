import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current user
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Get dashboard stats for the authenticated user
export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    // Get all courses for this user
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_rep", (q) => q.eq("repId", userId))
      .collect();

    const courseIds = courses.map((c) => c._id);

    // Get all active sessions for these courses
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

    const activeSessions = allSessions.flat();

    // Get attendance counts for active sessions
    const enrichedActiveSessions = await Promise.all(
      activeSessions.map(async (session) => {
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

    const totalStudentsSigned = enrichedActiveSessions.reduce(
      (acc, s) => acc + s.attendanceCount,
      0
    );

    return {
      user: {
        name: user.name,
        email: user.email,
        matricNumber: user.matricNumber,
      },
      courseCount: courses.length,
      activeSessionCount: activeSessions.length,
      totalStudentsSigned,
      activeSessions: enrichedActiveSessions,
    };
  },
});
