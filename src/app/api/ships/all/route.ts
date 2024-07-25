import { db } from "@/db";
import { ships } from "@/db/schema";

export async function GET(request: Request) {
  const results = await db.select().from(ships);
  return Response.json({
    count: results.length,
    results,
  });
}
