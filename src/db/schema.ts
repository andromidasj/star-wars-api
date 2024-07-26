import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

/**
 * =============================================================================
 *                                TABLES
 * =============================================================================
 */
export const planets = pgTable("planets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  climate: text("climate").notNull(),
  population: integer("population").notNull(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  homePlanetId: integer("home_planet_id")
    .notNull()
    .references(() => planets.id),
});

export const ships = pgTable("ships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  costInCredits: integer("cost_in_credits").notNull(),
});

export const charactersToShips = pgTable(
  // Many to many relationship table
  "characters_to_ships",
  {
    characterId: integer("character_id")
      .notNull()
      .references(() => characters.id),
    shipId: integer("ship_id")
      .notNull()
      .references(() => ships.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.characterId, t.shipId] }),
  })
);

/**
 * =============================================================================
 *                                RELATIONS
 * =============================================================================
 */
export const planetsRelations = relations(planets, ({ many }) => ({
  characters: many(characters),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  homePlanet: one(planets, {
    fields: [characters.homePlanetId],
    references: [planets.id],
  }),
  ships: many(charactersToShips),
}));

export const shipsRelations = relations(ships, ({ many }) => ({
  characters: many(charactersToShips),
}));

export const charactersToShipsRelations = relations(
  charactersToShips,
  ({ one }) => ({
    characters: one(characters, {
      fields: [charactersToShips.characterId],
      references: [characters.id],
    }),
    ships: one(ships, {
      fields: [charactersToShips.shipId],
      references: [ships.id],
    }),
  })
);

/**
 * =============================================================================
 *                                VALIDATION
 * =============================================================================
 */
export const insertCharacterSchema = createInsertSchema(characters);
export const insertPlanetSchema = createInsertSchema(planets);
export const insertShipSchema = createInsertSchema(ships);
