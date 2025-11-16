import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    // console.log("MongoDB already connected.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "AdaptBD",
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log("MongoDB connected:", conn.connection.host);

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
