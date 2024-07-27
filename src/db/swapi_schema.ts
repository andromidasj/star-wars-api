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
const starships = pgTable("starships", {
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
const people = pgTable("people", {
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
const planets = pgTable("planets", {
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
const films = pgTable("films", {
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
const species = pgTable("species", {
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
const vehicles = pgTable("vehicles", {
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
const filmsToCharacters = pgTable("films_to_characters", {
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id),
  characterId: integer("character_id")
    .notNull()
    .references(() => people.id),
});

// Films <-> Planets
const filmsToPlanets = pgTable("films_to_planets", {
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id),
  planetId: integer("planet_id")
    .notNull()
    .references(() => planets.id),
});

// Films <-> Starships
const filmsToStarships = pgTable("films_to_starships", {
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id),
  starshipId: integer("starship_id")
    .notNull()
    .references(() => starships.id),
});

// Films <-> Vehicles
const filmsToVehicles = pgTable("films_to_vehicles", {
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
});

// Films <-> Species
const filmsToSpecies = pgTable("films_to_species", {
  filmId: integer("film_id")
    .notNull()
    .references(() => films.id),
  speciesId: integer("species_id")
    .notNull()
    .references(() => species.id),
});

// People <-> Species
const peopleToSpecies = pgTable("people_to_species", {
  personId: integer("person_id")
    .notNull()
    .references(() => people.id),
  speciesId: integer("species_id")
    .notNull()
    .references(() => species.id),
});

// People <-> Vehicles
const peopleToVehicles = pgTable("people_to_vehicles", {
  personId: integer("person_id")
    .notNull()
    .references(() => people.id),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
});

// People <-> Starships
const peopleToStarships = pgTable("people_to_starships", {
  personId: integer("person_id")
    .notNull()
    .references(() => people.id),
  starshipId: integer("starship_id")
    .notNull()
    .references(() => starships.id),
});

// Relations
const starshipsRelations = relations(starships, ({ many }) => ({
  pilots: many(peopleToStarships),
  films: many(filmsToStarships),
}));

const peopleRelations = relations(people, ({ one, many }) => ({
  homeworld: one(planets, {
    fields: [people.homeworldId],
    references: [planets.id],
  }),
  films: many(filmsToCharacters),
  species: many(peopleToSpecies),
  vehicles: many(peopleToVehicles),
  starships: many(peopleToStarships),
}));

const planetsRelations = relations(planets, ({ many }) => ({
  residents: many(people),
  films: many(filmsToPlanets),
}));

const filmsRelations = relations(films, ({ many }) => ({
  characters: many(filmsToCharacters),
  planets: many(filmsToPlanets),
  starships: many(filmsToStarships),
  vehicles: many(filmsToVehicles),
  species: many(filmsToSpecies),
}));

const speciesRelations = relations(species, ({ one, many }) => ({
  homeworld: one(planets, {
    fields: [species.homeworldId],
    references: [planets.id],
  }),
  people: many(peopleToSpecies),
  films: many(filmsToSpecies),
}));

const vehiclesRelations = relations(vehicles, ({ many }) => ({
  pilots: many(peopleToVehicles),
  films: many(filmsToVehicles),
}));

/**
 * =============================================================================
 *                                VALIDATION
 * =============================================================================
 */
const insertPeopleSchema = createInsertSchema(people);
const insertPlanetSchema = createInsertSchema(planets);
const insertStarshipsSchema = createInsertSchema(starships);
const insertVehiclesSchema = createInsertSchema(vehicles);
const insertFilmsSchema = createInsertSchema(films);
const insertSpeciesSchema = createInsertSchema(species);
