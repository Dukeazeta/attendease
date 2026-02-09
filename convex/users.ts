import { v } from "convex/values";
import { mutation, query } from "convex/server";

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const getUserByEmailOrMatricNumber = query({
  args: {
    email: v.string(),
    matricNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const byEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (byEmail) {
      return byEmail;
    }

    if (!args.matricNumber) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_matricNumber", (q) => q.eq("matricNumber", args.matricNumber))
      .unique();
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    matricNumber: v.optional(v.string()),
    externalId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existingByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingByEmail) {
      throw new Error("User with this email already exists");
    }

    if (args.matricNumber) {
      const existingByMatric = await ctx.db
        .query("users")
        .withIndex("by_matricNumber", (q) => q.eq("matricNumber", args.matricNumber))
        .unique();

      if (existingByMatric) {
        throw new Error("User with this matric number already exists");
      }
    }

    const id = await ctx.db.insert("users", {
      externalId: args.externalId,
      name: args.name,
      email: args.email,
      password: args.password,
      matricNumber: args.matricNumber,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(id);
  },
});
