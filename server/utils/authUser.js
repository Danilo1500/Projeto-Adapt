import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

const buildBaseUsername = (email = "", firstName = "", lastName = "") => {
  const emailPrefix = email.split("@")[0]?.trim();
  const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
  const namePrefix = fullName.replace(/[^a-z0-9]+/gi, "").slice(0, 20);

  return emailPrefix || namePrefix || "adaptuser";
};

const ensureUniqueUsername = async (baseUsername, userId) => {
  let username = baseUsername;
  let suffix = 0;

  while (true) {
    const existingUser = await User.findOne({ username });
    if (!existingUser || existingUser._id === userId) {
      return username;
    }

    suffix += 1;
    username = `${baseUsername}${suffix}`;
  }
};

export const findOrCreateAuthenticatedUser = async (userId) => {
  if (!userId) {
    return null;
  }

  let user = await User.findById(userId);
  if (user) {
    return user;
  }

  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
  const firstName = clerkUser.firstName || "";
  const lastName = clerkUser.lastName || "";
  const username = await ensureUniqueUsername(
    buildBaseUsername(email, firstName, lastName),
    userId
  );

  user = await User.create({
    _id: userId,
    email,
    full_name: `${firstName} ${lastName}`.trim() || username,
    profile_picture: clerkUser.imageUrl || "",
    username,
  });

  return user;
};
