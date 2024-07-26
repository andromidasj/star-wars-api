import { jsonb, pgEnum, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const entitiesEnum = pgEnum("entity_type", [
  "people",
  "planets",
  "starships",
  "vehicles",
  "films",
  "species",
]);

export const entityOverrides = pgTable("entity_overrides", {
  id: serial("id").primaryKey(),
  entityType: entitiesEnum("entity_type").notNull(),
  entityId: serial("entity_id").notNull(),
  customData: jsonb("custom_data").notNull(),
  created: timestamp("created").defaultNow(),
  edited: timestamp("edited").defaultNow(),
});
