import { SWAPI } from "@/utils/SWAPI";

export async function GET(_request: Request) {
  try {
    const list = await SWAPI.getOptions();
    return Response.json(list);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
