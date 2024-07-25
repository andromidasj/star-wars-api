import { db } from "@/db";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { z } from "zod";

type InsertEntityOptions<
  T extends PgTableWithColumns<any>,
  S extends z.ZodObject<any>
> = {
  request: Request;
  table: T;
  zodSchema: S;
};

export default async function insertEntity<
  T extends PgTableWithColumns<any>,
  S extends z.ZodObject<any>
>({ request, table, zodSchema }: InsertEntityOptions<T, S>): Promise<Response> {
  let body;

  try {
    body = await request.json();
  } catch (error) {
    return Response.json(
      { error: { message: "Invalid request body" } },
      { status: 400 }
    );
  }

  // Validate the request body using the Zod schema
  const parsed = zodSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    // Insert the character into the database
    const result = await db
      .insert(table)
      .values(parsed.data as z.infer<S>)
      .returning();

    return Response.json(result[0]);
  } catch (error) {
    return Response.json(
      { error: { message: "Error inserting entity into database" } },
      { status: 500 }
    );
  }
}
