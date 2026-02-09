import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all courses for the authenticated user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_rep", (q) => q.eq("repId", userId))
      .collect();

    // Get session counts for each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const sessions = await ctx.db
          .query("attendanceSessions")
          .withIndex("by_course", (q) => q.eq("courseId", course._id))
          .collect();
        return {
          ...course,
          sessionCount: sessions.length,
        };
      })
    );

    return coursesWithCounts;
  },
});

// Create a new course
export const create = mutation({
  args: {
    courseCode: v.string(),
    courseTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if course code already exists for this rep
    const existing = await ctx.db
      .query("courses")
      .withIndex("by_code_and_rep", (q) =>
        q.eq("courseCode", args.courseCode).eq("repId", userId)
      )
      .first();

    if (existing) {
      throw new Error("You already have a course with this code");
    }

    return await ctx.db.insert("courses", {
      courseCode: args.courseCode,
      courseTitle: args.courseTitle,
      repId: userId,
    });
  },
});

// Delete a course
export const remove = mutation({
  args: {
    id: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const course = await ctx.db.get(args.id);
    if (!course) {
      throw new Error("Course not found");
    }

    if (course.repId !== userId) {
      throw new Error("Unauthorized");
    }

    // Delete all sessions and attendances for this course
    const sessions = await ctx.db
      .query("attendanceSessions")
      .withIndex("by_course", (q) => q.eq("courseId", args.id))
      .collect();

    for (const session of sessions) {
      // Delete all attendances for this session
      const attendances = await ctx.db
        .query("attendances")
        .withIndex("by_session", (q) => q.eq("sessionId", session._id))
        .collect();

      for (const attendance of attendances) {
        await ctx.db.delete(attendance._id);
      }

      await ctx.db.delete(session._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Get a single course by ID
export const get = query({
  args: {
    id: v.id("courses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
