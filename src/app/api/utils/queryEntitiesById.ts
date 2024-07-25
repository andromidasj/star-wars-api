import { db } from "@/db";
import { eq, SQL } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

export async function queryEntitiesById<T extends PgTableWithColumns<any>>(
  table: T,
  rawId: string,
  entityName: string
): Promise<Response> {
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

  // Doing some type casting here because the type of the idColumn is not known
  const idColumn = table.id as unknown as SQL<number>;

  // Query the database
  let result;

  try {
    result = await db
      .select()
      .from(table)
      .where(eq(idColumn, parsedId))
      .limit(1);
  } catch (error) {
    return Response.json(
      { error: { message: "Error querying database." } },
      { status: 400 }
    );
  }

  // Handle the case where no entity is found
  if (result.length === 0) {
    return Response.json(
      { error: { message: `${entityName} with ID ${rawId} not found.` } },
      { status: 404 }
    );
  }

  // Return the successful result
  return Response.json(result[0]);
}
