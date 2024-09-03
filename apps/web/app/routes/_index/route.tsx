import { useLiveQuery } from "@electric-sql/pglite-react";
import { food } from "@pglite/schema";
import { desc } from "drizzle-orm";
import { Array, pipe } from "effect";
import { usePgLiteClient } from "~/pglite-client-provider";
import InsertFoodForm from "./insert-food-form";

export default function Index() {
  const query = usePgLiteClient();
  const foods = useLiveQuery<typeof food.$inferSelect>(
    // 👇 Query built using Drizzle, and executed as SQL string for PGLite live query
    query((_) => _.select().from(food).orderBy(desc(food.id)).toSQL().sql),
    [],
  );

  return (
    <main>
      <InsertFoodForm />
      {pipe(
        foods?.rows ?? [],
        Array.match({
          onEmpty: () => <p>No foods</p>,
          onNonEmpty: (foods) => (
            <div>
              {foods.map((food) => (
                <div key={food.id}>
                  <p>{`${food.name} (${food.id})`}</p>
                  <div>{`${food.calories} calories`}</div>
                  <div>{`${food.fat} fat`}</div>
                  <div>{`${food.carbohydrate} carbohydrate`}</div>
                  <div>{`${food.protein} protein`}</div>
                </div>
              ))}
            </div>
          ),
        }),
      )}
    </main>
  );
}
