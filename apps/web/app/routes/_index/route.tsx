import { useLoaderData } from "@remix-run/react";
import { Array, Effect, pipe } from "effect";
import { ApiDatabase } from "~/services/ApiDatabase";
import { RuntimeClient } from "~/services/RuntimeClient";
import { Versioning } from "~/services/Versioning";
import InsertFoodForm from "./insert-food-form";

export const clientLoader = async () => {
  return RuntimeClient.runPromise(
    Effect.gen(function* () {
      const appVersion = yield* Versioning.up;
      const foods = yield* ApiDatabase.getAllFoods;
      return { appVersion, foods };
    }),
  );
};

export function HydrateFallback() {
  return <p>Getting your data ready...</p>;
}

export default function Index() {
  const { appVersion, foods } = useLoaderData<typeof clientLoader>();
  return (
    <main>
      <p>{`Running on version ${appVersion}`}</p>
      <InsertFoodForm />

      {pipe(
        foods,
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
