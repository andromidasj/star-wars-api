import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Starships table
export const starships = pgTable("starships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  manufacturer: text("manufacturer").notNull(),
  costInCredits: text("cost_in_credits"),
  length: text("length"),
  maxAtmospheringSpeed: text("max_atmosphering_speed"),
  crew: text("crew"),
  passengers: text("passengers"),
  cargoCapacity: text("cargo_capacity"),
  consumables: text("consumables"),
  hyperdriveRating: text("hyperdrive_rating"),
  mglt: text("mglt"),
  starshipClass: text("starship_class"),
  created: timestamp("created").notNull(),
  edited: timestamp("edited").notNull(),
  url: text("url").notNull(),
});

// People table
export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  height: text("height"),
  mass: text("mass"),
  hairColor: text("hair_color"),
  skinColor: text("skin_color"),
  eyeColor: text("eye_color"),
  birthYear: text("birth_year"),
  gender: text("gender"),
  homeworldId: integer("homeworld_id").references(() => planets.id),
  created: timestamp("created").notNull(),
  edited: timestamp("edited").notNull(),
  url: text("url").notNull(),
});

// Planets table
export const planets = pgTable("planets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rotationPeriod: text("rotation_period"),
  orbitalPeriod: text("orbital_period"),
  diameter: text("diameter"),
  climate: text("climate"),
  gravity: text("gravity"),
  terrain: text("terrain"),
  surfaceWater: text("surface_water"),
  population: text("population"),
  created: timestamp("created").notNull(),
  edited: timestamp("edited").notNull(),
  url: text("url").notNull(),
});

// Films table
export const films = pgTable("films", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  episodeId: integer("episode_id").notNull(),
  openingCrawl: text("opening_crawl").notNull(),
  director: text("director").notNull(),
  producer: text("producer").notNull(),
  releaseDate: date("release_date").notNull(),
  created: timestamp("created").notNull(),
  edited: timestamp("edited").notNull(),
  url: text("url").notNull(),
});

// Species table
export const species = pgTable("species", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  classification: text("classification"),
  designation: text("designation"),
  averageHeight: text("average_height"),
  skinColors: text("skin_colors"),
  hairColors: text("hair_colors"),
  eyeColors: text("eye_colors"),
  averageLifespan: text("average_lifespan"),
  homeworldId: integer("homeworld_id").references(() => planets.id),
  language: text("language"),
  created: timestamp("created").notNull(),
  edited: timestamp("edited").notNull(),
  url: text("url").notNull(),
});

// Vehicles table
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  manufacturer: text("manufacturer").notNull(),
  costInCredits: text("cost_in_credits"),
  length: text("length"),
  maxAtmospheringSpeed: text("max_atmosphering_speed"),
  crew: text("crew"),
  passengers: text("passengers"),
  cargoCapacity: text("cargo_capacity"),
  consumables: text("consumables"),
  vehicleClass: text("vehicle_class"),
  created: timestamp("created").notNull(),
  edited: timestamp("edited").notNull(),
  url: text("url").notNull(),
});

// Many-to-many relationships

// Films <-> People
export const filmsToCharacters = pgTable("films_to_characters", {
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id),
  characterId: integer("character_id")
    .notNull()
    .references(() => people.id),
});

// Films <-> Planets
export const filmsToPlanets = pgTable("films_to_planets", {
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id),
  planetId: integer("planet_id")
    .notNull()
    .references(() => planets.id),
});

// Films <-> Starships
export const filmsToStarships = pgTable("films_to_starships", {
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id),
  starshipId: integer("starship_id")
    .notNull()
    .references(() => starships.id),
});

// Films <-> Vehicles
export const filmsToVehicles = pgTable("films_to_vehicles", {
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
});

// Films <-> Species
export const filmsToSpecies = pgTable("films_to_species", {
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id),
  speciesId: integer("species_id")
    .notNull()
    .references(() => species.id),
});

// People <-> Species
export const peopleToSpecies = pgTable("people_to_species", {
  personId: integer("person_id")
    .notNull()
    .references(() => people.id),
  speciesId: integer("species_id")
    .notNull()
    .references(() => species.id),
});

// People <-> Vehicles
export const peopleToVehicles = pgTable("people_to_vehicles", {
  personId: integer("person_id")
    .notNull()
    .references(() => people.id),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
});

// People <-> Starships
export const peopleToStarships = pgTable("people_to_starships", {
  personId: integer("person_id")
    .notNull()
    .references(() => people.id),
  starshipId: integer("starship_id")
    .notNull()
    .references(() => starships.id),
});

// Relations
export const starshipsRelations = relations(starships, ({ many }) => ({
  pilots: many(peopleToStarships),
  films: many(filmsToStarships),
}));

export const peopleRelations = relations(people, ({ one, many }) => ({
  homeworld: one(planets, {
    fields: [people.homeworldId],
    references: [planets.id],
  }),
  films: many(filmsToCharacters),
  species: many(peopleToSpecies),
  vehicles: many(peopleToVehicles),
  starships: many(peopleToStarships),
}));

export const planetsRelations = relations(planets, ({ many }) => ({
  residents: many(people),
  films: many(filmsToPlanets),
}));

export const filmsRelations = relations(films, ({ many }) => ({
  characters: many(filmsToCharacters),
  planets: many(filmsToPlanets),
  starships: many(filmsToStarships),
  vehicles: many(filmsToVehicles),
  species: many(filmsToSpecies),
}));

export const speciesRelations = relations(species, ({ one, many }) => ({
  homeworld: one(planets, {
    fields: [species.homeworldId],
    references: [planets.id],
  }),
  people: many(peopleToSpecies),
  films: many(filmsToSpecies),
}));

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  pilots: many(peopleToVehicles),
  films: many(filmsToVehicles),
}));

/**
 * =============================================================================
 *                                VALIDATION
 * =============================================================================
 */
export const insertPeopleSchema = createInsertSchema(people);
export const insertPlanetSchema = createInsertSchema(planets);
export const insertStarshipsSchema = createInsertSchema(starships);
export const insertVehiclesSchema = createInsertSchema(vehicles);
export const insertFilmsSchema = createInsertSchema(films);
export const insertSpeciesSchema = createInsertSchema(species);
