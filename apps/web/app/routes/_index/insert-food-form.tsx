import { useActor } from "@xstate/react";
import { insertFoodMachine } from "~/machines/inser-food-machine";

export default function InsertFoodForm() {
  const [snapshot, send] = useActor(insertFoodMachine);
  return (
    <div>
      <form onSubmit={(formEvent) => send({ type: "food.insert", formEvent })}>
        <input type="text" name="name" placeholder="Name" />
        <input type="number" name="calories" placeholder="Calories" />
        <input type="number" name="fat" placeholder="Fat" />
        <input type="number" name="carbohydrate" placeholder="Carbohydrate" />
        <input type="number" name="protein" placeholder="Protein" />
        <button type="submit" disabled={snapshot.matches("Inserting")}>
          Insert
        </button>
      </form>

      {snapshot.matches("Success") && <p>Success!</p>}
    </div>
  );
}
