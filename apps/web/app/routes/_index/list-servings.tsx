import { useLiveQuery } from "@electric-sql/pglite-react";
import { food, serving } from "@pglite/schema";
import { desc, eq } from "drizzle-orm";
import { usePgLiteClient } from "~/pglite-client-provider";

type Serving = typeof serving.$inferSelect;
type Food = typeof food.$inferSelect;

export default function ListServings() {
  const query = usePgLiteClient();
  const servings = useLiveQuery<{
    id: Serving["id"];
    quantity: Serving["quantity"];
    name: Food["name"];
  }>(
    query((_) =>
      _.select({
        id: serving.id,
        quantity: serving.quantity,
        name: food.name,
      })
        .from(serving)
        .leftJoin(food, eq(food.id, serving.food_id))
        .orderBy(desc(serving.id)),
    ),
    [],
  );

  return (
    <div>
      {servings?.rows.map((serving) => (
        <p key={serving.id}>
          {serving.name} - {serving.quantity}
        </p>
      ))}
    </div>
  );
}
