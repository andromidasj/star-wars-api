import { db } from "@/db";
import { eq, SQL } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

type GetByIdResult<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

export async function getByIdWithErrorHandling<
  T extends PgTableWithColumns<any>
>(
  table: T,
  rawId: string,
  entityName: string
): Promise<GetByIdResult<T["$inferSelect"]>> {
  // Parse and validate the ID
  const id = Number(rawId);
  if (isNaN(id)) {
    return {
      data: null,
      error: `Invalid ID: \`${rawId}\`. Please provide a valid ${entityName} ID, which should be a number.`,
      status: 400,
    };
  }

  // Check if the table has an id column
  if (!("id" in table)) {
    throw new Error("Table must have an 'id' column");
  }

  const idColumn = table.id as unknown as SQL<number>;

  // Query the database
  const result = await db.select().from(table).where(eq(idColumn, id)).limit(1);

  // Handle the case where no entity is found
  if (result.length === 0) {
    return {
      data: null,
      error: `${entityName} with ID ${rawId} not found.`,
      status: 404,
    };
  }

  // Return the successful result
  return {
    data: result[0] as T["$inferSelect"],
    error: null,
    status: 200,
  };
}
