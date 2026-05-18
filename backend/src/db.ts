import mongoose from "mongoose";

/** Ouvre la connexion Mongoose vers MongoDB Atlas. */
export async function connectToDatabase(uri: string): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("[db] connected to MongoDB Atlas");
}
