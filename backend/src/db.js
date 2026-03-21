import mongoose from "mongoose";
import { getEnvVar } from "./getEnvVar.js";

export async function connectToDatabase() {
  const mongoUri = getEnvVar("MONGODB_URI");
  await mongoose.connect(mongoUri);
}
