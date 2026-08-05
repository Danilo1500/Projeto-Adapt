import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";
import User from "../models/User.js";

const DEFAULT_DB_NAME = process.env.MONGODB_DB_NAME || "AdaptBD";
const DEFAULT_DNS_SERVERS = ["1.1.1.1", "8.8.8.8"];

const ensureWorkingDnsResolvers = () => {
  const configuredServers = process.env.MONGODB_DNS_SERVERS
    ?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  const currentServers = dns.getServers();
  const usingLoopbackOnly =
    currentServers.length > 0 &&
    currentServers.every((server) => server === "127.0.0.1" || server === "::1");

  if (!configuredServers?.length && !usingLoopbackOnly) {
    return;
  }

  dns.setServers(configuredServers?.length ? configuredServers : DEFAULT_DNS_SERVERS);
};

const buildMongoUri = (rawUri) => {
  const trimmedUri = rawUri?.trim();

  if (!trimmedUri) {
    throw new Error("MONGODB_URL is not set");
  }

  const schemeMatch = trimmedUri.match(/^mongodb(?:\+srv)?:\/\//i);
  if (!schemeMatch) {
    return trimmedUri;
  }

  const scheme = schemeMatch[0];
  const remainder = trimmedUri.slice(scheme.length);
  const [authorityAndPath, queryString = ""] = remainder.split("?");
  const firstSlashIndex = authorityAndPath.indexOf("/");
  const authority =
    firstSlashIndex === -1 ? authorityAndPath : authorityAndPath.slice(0, firstSlashIndex);
  const path =
    firstSlashIndex === -1 ? "" : authorityAndPath.slice(firstSlashIndex + 1).replace(/\/+$/, "");

  if (path) {
    return trimmedUri;
  }

  const withDbName = `${scheme}${authority}/${DEFAULT_DB_NAME}`;
  return queryString ? `${withDbName}?${queryString}` : withDbName;
};

const connect = async () => {
  const uri = buildMongoUri(process.env.MONGODB_URL);
  ensureWorkingDnsResolvers();
  mongoose.connection.on("connected", () => console.log("Database connected"));
  await mongoose.connect(uri);
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
