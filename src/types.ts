import { z } from "zod";

export type DynamicIdParams = {
  params: {
    entity: string;
    id: string;
  };
};

// Common fields for all entities
const commonFields = {
  created: z.string(),
  edited: z.string(),
  url: z.string().url(),
};

// Starships schema
const starshipSchema = z.object({
  ...commonFields,
  name: z.string(),
  model: z.string(),
  manufacturer: z.string(),
  cost_in_credits: z.string(),
  length: z.string(),
  max_atmosphering_speed: z.string(),
  crew: z.string(),
  passengers: z.string(),
  cargo_capacity: z.string(),
  consumables: z.string(),
  hyperdrive_rating: z.string(),
  MGLT: z.string(),
  starship_class: z.string(),
  pilots: z.array(z.string().url()),
  films: z.array(z.string().url()),
});

// People schema
const peopleSchema = z.object({
  ...commonFields,
  name: z.string(),
  height: z.string(),
  mass: z.string(),
  hair_color: z.string(),
  skin_color: z.string(),
  eye_color: z.string(),
  birth_year: z.string(),
  gender: z.string(),
  homeworld: z.string().url(),
  films: z.array(z.string().url()),
  species: z.array(z.string().url()),
  vehicles: z.array(z.string().url()),
  starships: z.array(z.string().url()),
});

// Planets schema
const planetSchema = z.object({
  ...commonFields,
  name: z.string(),
  rotation_period: z.string(),
  orbital_period: z.string(),
  diameter: z.string(),
  climate: z.string(),
  gravity: z.string(),
  terrain: z.string(),
  surface_water: z.string(),
  population: z.string(),
  residents: z.array(z.string().url()),
  films: z.array(z.string().url()),
});

// Films schema
const filmSchema = z.object({
  ...commonFields,
  title: z.string(),
  episode_id: z.number(),
  opening_crawl: z.string(),
  director: z.string(),
  producer: z.string(),
  release_date: z.string(),
  characters: z.array(z.string().url()),
  planets: z.array(z.string().url()),
  starships: z.array(z.string().url()),
  vehicles: z.array(z.string().url()),
  species: z.array(z.string().url()),
});

// Species schema
const speciesSchema = z.object({
  ...commonFields,
  name: z.string(),
  classification: z.string(),
  designation: z.string(),
  average_height: z.string(),
  skin_colors: z.string(),
  hair_colors: z.string(),
  eye_colors: z.string(),
  average_lifespan: z.string(),
  homeworld: z.string().url().nullable(),
  language: z.string(),
  people: z.array(z.string().url()),
  films: z.array(z.string().url()),
});

// Vehicles schema
const vehicleSchema = z.object({
  ...commonFields,
  name: z.string(),
  model: z.string(),
  manufacturer: z.string(),
  cost_in_credits: z.string(),
  length: z.string(),
  max_atmosphering_speed: z.string(),
  crew: z.string(),
  passengers: z.string(),
  cargo_capacity: z.string(),
  consumables: z.string(),
  vehicle_class: z.string(),
  pilots: z.array(z.string().url()),
  films: z.array(z.string().url()),
});

const notFoundSchema = z.object({
  detail: z.literal("Not found"),
});

// Function to create a union type with the notFoundSchema
const withNotFound = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, notFoundSchema]);

// Schema for list responses
export const listResponseSchema = <T extends z.ZodTypeAny>(entitySchema: T) =>
  z.object({
    count: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(entitySchema),
  });

// Export all schemas with the "Not found" possibility (for single entities)
// or with the list response wrapper (for lists of entities)
export const SwapiSchemas = {
  Starship: withNotFound(starshipSchema),
  StarshipList: listResponseSchema(starshipSchema),
  People: withNotFound(peopleSchema),
  PeopleList: listResponseSchema(peopleSchema),
  Planet: withNotFound(planetSchema),
  PlanetList: listResponseSchema(planetSchema),
  Film: withNotFound(filmSchema),
  FilmList: listResponseSchema(filmSchema),
  Species: withNotFound(speciesSchema),
  SpeciesList: listResponseSchema(speciesSchema),
  Vehicle: withNotFound(vehicleSchema),
  VehicleList: listResponseSchema(vehicleSchema),
  ANY_LIST: listResponseSchema(z.object(commonFields)),
};

export const SingleEntitySchemas = [
  SwapiSchemas.Starship,
  SwapiSchemas.People,
  SwapiSchemas.Planet,
  SwapiSchemas.Film,
  SwapiSchemas.Species,
  SwapiSchemas.Vehicle,
] as const;

export const entityTypesArr = [
  "people",
  "planets",
  "starships",
  "vehicles",
  "films",
  "species",
] as const;
export const EntityTypeEnumSchema = z.enum(entityTypesArr);
export type EntityType = (typeof entityTypesArr)[number];
