import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all locations for the authenticated user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("locations")
      .withIndex("by_creator", (q) => q.eq("createdBy", userId))
      .collect();
  },
});

// Create a new location
export const create = mutation({
  args: {
    name: v.string(),
    building: v.optional(v.string()),
    latitude: v.float64(),
    longitude: v.float64(),
    radiusMeters: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("locations", {
      name: args.name,
      building: args.building,
      latitude: args.latitude,
      longitude: args.longitude,
      radiusMeters: args.radiusMeters,
      createdBy: userId,
    });
  },
});

// Delete a location
export const remove = mutation({
  args: {
    id: v.id("locations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const location = await ctx.db.get(args.id);
    if (!location) {
      throw new Error("Location not found");
    }

    if (location.createdBy !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

// Get a single location by ID
export const get = query({
  args: {
    id: v.id("locations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
