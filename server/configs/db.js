import dns from "node:dns";
import mongoose from "mongoose";

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
    throw new Error("MONGODB_URL is not set. Check server/.env.");
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

const connectDB = async () => {
  const mongoUrl = buildMongoUri(process.env.MONGODB_URL);

  ensureWorkingDnsResolvers();
  mongoose.connection.on("connected", () => console.log("Database connected"));

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    if (error?.message?.includes("querySrv")) {
      throw new Error(
        "MongoDB SRV lookup failed. If you are using MongoDB Atlas, try a non-SRV URI in MONGODB_URL or check local DNS access to _mongodb._tcp records."
      );
    }

    throw error;
  }
};

export default connectDB;
