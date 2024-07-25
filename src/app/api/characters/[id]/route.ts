import { characters } from "@/db/schema";
import { getByIdWithErrorHandling } from "../../utils";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const result = await getByIdWithErrorHandling(
    characters,
    params.id,
    "Character"
  );

  if (result.error) {
    const { error, status } = result;
    return Response.json({ error }, { status });
  }

  return Response.json(result.data);
}
