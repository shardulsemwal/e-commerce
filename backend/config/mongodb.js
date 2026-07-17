import dns from "node:dns";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI or MONGO_URI is not defined");
    }
    const connectionUrl = new URL(mongoUri);
    if (!connectionUrl.pathname || connectionUrl.pathname === "/") {
      connectionUrl.pathname = "/e-commerce";
    }
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    console.log(process.env.MONGO_URI);
    await mongoose.connect(connectionUrl.toString());
  } catch (error) {
    console.error("Mongo Error:");
    console.error(error);
    throw error;
  }
};
export default connectDB;
