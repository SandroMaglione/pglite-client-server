import { useLiveQuery } from "@electric-sql/pglite-react";
import { food } from "@pglite/schema";
import { useActor } from "@xstate/react";
import { desc } from "drizzle-orm";
import { Array, pipe } from "effect";
import { addServingMachine } from "~/machines/add-serving-machine";
import { usePgLiteClient } from "~/pglite-client-provider";

export default function AddServingForm() {
  const [snapshot, send] = useActor(addServingMachine);
  const query = usePgLiteClient();
  const foods = useLiveQuery<typeof food.$inferSelect>(
    query((_) => _.select().from(food).orderBy(desc(food.id))),
    [],
  );

  if (snapshot.matches("Adding")) {
    return <p>Adding...</p>;
  }

  return (
    <form onSubmit={(formEvent) => send({ type: "serving.add", formEvent })}>
      <input
        type="number"
        name="quantity"
        placeholder="Quantity (g)"
        defaultValue={100}
      />
      <div>
        {pipe(
          foods?.rows ?? [],
          Array.match({
            onEmpty: () => <p>No foods</p>,
            onNonEmpty: (foods) => (
              <>
                {foods.map((food) => (
                  <p key={food.id}>
                    <input
                      id={`${food.id}`}
                      type="radio"
                      name="foodId"
                      value={food.id}
                    />
                    <label htmlFor={`${food.id}`}>{food.name}</label>
                  </p>
                ))}
              </>
            ),
          }),
        )}
      </div>
      <button type="submit" disabled={snapshot.matches("Adding")}>
        Add
      </button>
      {snapshot.matches("Success") && <p>Success!</p>}
    </form>
  );
}
