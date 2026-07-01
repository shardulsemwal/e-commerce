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
    await mongoose.connect(connectionUrl.toString());
  } catch (error) {
    console.log("Mongo Error:");
    console.log(error);
  }
};
export default connectDB;
