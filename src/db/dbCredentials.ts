export const dbCredentials = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || undefined,
  password: process.env.DB_PASSWORD || undefined,
  ssl: !!process.env.DB_PASSWORD || undefined,
};
