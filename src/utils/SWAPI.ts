import { SwapiSchemas } from "@/types";

/**
 * My simple wrapper around the SWAPI API. Instead of handling each fetch request individually,
 * I'm setting up a class with static methods that handle each request. This way, I can easily
 * grab the data from the API (and parse it using Zod for type safety).
 */
export class SWAPI {
  static async getOptions() {
    const response = await fetch("https://swapi.dev/api");
    return await response.json();
  }

  static async getPeople() {
    const response = await fetch("https://swapi.dev/api/people");
    const data = await response.json();
    return SwapiSchemas.PeopleList.parse(data);
  }

  static async getPersonById(id: number) {
    const response = await fetch(`https://swapi.dev/api/people/${id}`);
    const data = await response.json();
    return SwapiSchemas.People.parse(data);
  }

  static async getPlanets() {
    const response = await fetch("https://swapi.dev/api/planets");
    const data = await response.json();
    return SwapiSchemas.PlanetList.parse(data);
  }

  static async getPlanetById(id: number) {
    const response = await fetch(`https://swapi.dev/api/planets/${id}`);
    const data = await response.json();
    return SwapiSchemas.Planet.parse(data);
  }

  static async getStarships() {
    const response = await fetch("https://swapi.dev/api/starships");
    const data = await response.json();
    return SwapiSchemas.StarshipList.parse(data);
  }

  static async getStarshipById(id: number) {
    const response = await fetch(`https://swapi.dev/api/starships/${id}`);
    const data = await response.json();
    return SwapiSchemas.Starship.parse(data);
  }

  static async getVehicles() {
    const response = await fetch("https://swapi.dev/api/vehicles");
    const data = await response.json();
    return SwapiSchemas.VehicleList.parse(data);
  }

  static async getVehicleById(id: number) {
    const response = await fetch(`https://swapi.dev/api/vehicles/${id}`);
    const data = await response.json();
    return SwapiSchemas.Vehicle.parse(data);
  }

  static async getFilms() {
    const response = await fetch("https://swapi.dev/api/films");
    const data = await response.json();
    return SwapiSchemas.FilmList.parse(data);
  }

  static async getFilmById(id: number) {
    const response = await fetch(`https://swapi.dev/api/films/${id}`);
    const data = await response.json();
    return SwapiSchemas.Film.parse(data);
  }

  static async getSpecies() {
    const response = await fetch("https://swapi.dev/api/species");
    const data = await response.json();
    return SwapiSchemas.SpeciesList.parse(data);
  }

  static async getSpeciesById(id: number) {
    const response = await fetch(`https://swapi.dev/api/species/${id}`);
    const data = await response.json();
    return SwapiSchemas.Species.parse(data);
  }
}
