import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const connect = async () => {
  const uri = process.env.MONGODB_URL;
  if (!uri) {
    throw new Error("MONGODB_URL is not set");
  }
  mongoose.connection.on("connected", () => console.log("Database connected"));
  await mongoose.connect(`${uri}/AdaptBD`);
};

const uniq = (arr = []) => Array.from(new Set(arr.map((v) => v?.toString?.() || v)));

const dedupe = async () => {
  await connect();

  const users = await User.find({});
  let updated = 0;

  for (const user of users) {
    const nextConnections = uniq(user.connections);
    const nextFollowers = uniq(user.followers);
    const nextFollowing = uniq(user.following);

    const changed =
      nextConnections.length !== user.connections.length ||
      nextFollowers.length !== user.followers.length ||
      nextFollowing.length !== user.following.length;

    if (changed) {
      user.connections = nextConnections;
      user.followers = nextFollowers;
      user.following = nextFollowing;
      await user.save();
      updated += 1;
    }
  }

  console.log(`Users updated: ${updated}`);
  await mongoose.disconnect();
};

dedupe().catch((err) => {
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});
