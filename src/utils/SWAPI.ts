import { SwapiSchemas } from "@/types";

export class SWAPI {
  private static baseUrl = "https://swapi.dev/api/" as const;

  static async getCharacters() {
    try {
      const response = await fetch("https://swapi.dev/api/people");
      const data = await response.json();
      const parsedData = SwapiSchemas.PeopleList.parse(data);
      return parsedData;
    } catch (error) {
      return { error };
    }
  }

  static async getCharacter(id: string) {}
}
