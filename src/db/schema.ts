import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

export const entityTypesArr = [
  "people",
  "planets",
  "starships",
  "vehicles",
  "films",
  "species",
] as const;

export const entitiesEnum = pgEnum("entity_type", entityTypesArr);

export const editedEntities = pgTable("edited_entities", {
  id: serial("id").primaryKey(),
  entityType: entitiesEnum("entity_type").notNull(),
  entityId: integer("entity_id").unique().notNull(),
  updatedData: jsonb("updated_data").notNull(),
  created: timestamp("created").defaultNow(),
  edited: timestamp("edited").defaultNow(),
});

export const deletedEntities = pgTable("deleted_entities", {
  id: serial("id").primaryKey(),
  entityType: entitiesEnum("entity_type").notNull(),
  entityId: integer("entity_id").unique().notNull(),
  created: timestamp("created").defaultNow(),
  edited: timestamp("edited").defaultNow(),
});

export const addedEntities = pgTable("added_entities", {
  id: serial("id").primaryKey(),
  entityType: entitiesEnum("entity_type").notNull(),
  entityId: integer("entity_id").unique().notNull(),
  entityData: jsonb("entity_data").notNull(),
  created: timestamp("created").defaultNow(),
  edited: timestamp("edited").defaultNow(),
});
