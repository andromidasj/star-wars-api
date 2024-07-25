import { db } from "@/db";
import { SQL, eq } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

type DeleteEntityOptions<T extends PgTableWithColumns<any>> = {
  id: string;
  table: T;
  entityName: string;
};

export async function deleteEntity<T extends PgTableWithColumns<any>>({
  id: rawId,
  table,
  entityName,
}: DeleteEntityOptions<T>): Promise<Response> {
  // Parse and validate the ID
  const parsedId = Number(rawId);
  if (isNaN(parsedId)) {
    return Response.json(
      {
        error: {
          message: `Invalid ID: \`${rawId}\`. Please provide a valid ${entityName} ID, which should be a number.`,
        },
      },
      { status: 400 }
    );
  }

  // Check if the table has an id column
  if (!("id" in table)) {
    throw new Error("Table must have an 'id' column");
  }

  const idColumn = table.id as unknown as SQL<number>;

  // Query the database
  let result;

  try {
    result = await db.delete(table).where(eq(idColumn, parsedId));
  } catch (error) {
    return Response.json(
      { error: { message: "Error deleting entity from database" } },
      { status: 500 }
    );
  }

  return Response.json(result);
}
