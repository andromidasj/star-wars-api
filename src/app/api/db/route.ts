import { db } from "@/db";
import { deletedEntities, editedEntities } from "@/db/schema";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  try {
    switch (type) {
      case "edited":
        return Response.json(await db.select().from(editedEntities));
      case "deleted":
        return Response.json(await db.select().from(deletedEntities));
      default:
        return Response.json(
          {
            error: {
              message:
                "Invalid type. Please specify either `edited` or `deleted`.",
            },
          },
          { status: 400 }
        );
    }
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
