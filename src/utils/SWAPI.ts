import { SwapiSchemas } from "@/types";

export class SWAPI {
  static async getPeople() {
    const response = await fetch("https://swapi.dev/api/people");
    const data = await response.json();
    const parsedData = SwapiSchemas.PeopleList.parse(data);
    return parsedData;
  }

  static async getPersonById(id: string) {
    const response = await fetch(`https://swapi.dev/api/people/${id}`);
    const data = await response.json();
    const parsedData = SwapiSchemas.People.parse(data);
    return parsedData;
  }

  static async getPlanets() {
    const response = await fetch("https://swapi.dev/api/planets");
    const data = await response.json();
    const parsedData = SwapiSchemas.PlanetList.parse(data);
    return parsedData;
  }

  static async getPlanetById(id: string) {
    const response = await fetch(`https://swapi.dev/api/planets/${id}`);
    const data = await response.json();
    const parsedData = SwapiSchemas.Planet.parse(data);
    return parsedData;
  }

  static async getStarships() {
    const response = await fetch("https://swapi.dev/api/starships");
    const data = await response.json();
    const parsedData = SwapiSchemas.StarshipList.parse(data);
    return parsedData;
  }

  static async getStarshipById(id: string) {
    const response = await fetch(`https://swapi.dev/api/starships/${id}`);
    const data = await response.json();
    const parsedData = SwapiSchemas.Starship.parse(data);
    return parsedData;
  }

  static async getVehicles() {
    const response = await fetch("https://swapi.dev/api/vehicles");
    const data = await response.json();
    const parsedData = SwapiSchemas.VehicleList.parse(data);
    return parsedData;
  }

  static async getVehicleById(id: string) {
    const response = await fetch(`https://swapi.dev/api/vehicles/${id}`);
    const data = await response.json();
    const parsedData = SwapiSchemas.Vehicle.parse(data);
    return parsedData;
  }

  static async getFilms() {
    const response = await fetch("https://swapi.dev/api/films");
    const data = await response.json();
    const parsedData = SwapiSchemas.FilmList.parse(data);
    return parsedData;
  }

  static async getFilmById(id: string) {
    const response = await fetch(`https://swapi.dev/api/films/${id}`);
    const data = await response.json();
    const parsedData = SwapiSchemas.Film.parse(data);
    return parsedData;
  }

  static async getSpecies() {
    const response = await fetch("https://swapi.dev/api/species");
    const data = await response.json();
    const parsedData = SwapiSchemas.SpeciesList.parse(data);
    return parsedData;
  }

  static async getSpeciesById(id: string) {
    const response = await fetch(`https://swapi.dev/api/species/${id}`);
    const data = await response.json();
    const parsedData = SwapiSchemas.Species.parse(data);
    return parsedData;
  }
}
