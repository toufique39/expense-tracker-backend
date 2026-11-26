import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import {
  connectDB,
  client,
} from "../config/db.js";

// Connect to MongoDB
const db = await connectDB();

// Configure trusted frontend origins
const trustedOrigins = [
  process.env.CLIENT_URL,
].filter(Boolean);

// Better Auth configuration
export const auth = betterAuth({
  appName: "Expense Tracker",
  database: mongodbAdapter(db, {
    client,
  }),

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
  },
});