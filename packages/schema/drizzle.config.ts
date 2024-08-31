import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/main.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    host: process.env.DB_HOST!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    user: process.env.DB_USER!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    password: process.env.DB_PASSWORD!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    database: process.env.DB_NAME!,
  },
});
