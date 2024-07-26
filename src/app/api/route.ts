import { DynamicIdParams } from "@/types";
import { SWAPI } from "@/utils/SWAPI";

export async function GET(_request: Request, { params }: DynamicIdParams) {
  const list = await SWAPI.getPeople();
  return Response.json(list);
}
