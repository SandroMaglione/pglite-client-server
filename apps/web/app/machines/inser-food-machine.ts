import { Schema } from "@effect/schema";
import { Effect } from "effect";
import { fromPromise, setup } from "xstate";
import { ApiDatabase } from "~/services/ApiDatabase";
import { FormData } from "~/services/FormData";
import { RuntimeClient } from "~/services/RuntimeClient";

type Event = {
  type: "food.insert";
  formEvent: React.FormEvent<HTMLFormElement>;
};

const inserting = fromPromise(
  ({ input }: { input: { formEvent: React.FormEvent<HTMLFormElement> } }) =>
    RuntimeClient.runPromise(
      Effect.gen(function* () {
        const api = yield* ApiDatabase;
        input.formEvent.preventDefault();
        const foodInsert = yield* FormData.fromSchema(
          Schema.Struct({
            name: Schema.String,
            calories: Schema.NumberFromString,
            fat: Schema.NumberFromString,
            carbohydrate: Schema.NumberFromString,
            protein: Schema.NumberFromString,
          }),
        );

        return yield* api.addFood(foodInsert);
      }).pipe(
        Effect.provideService(
          FormData,
          new globalThis.FormData(input.formEvent.currentTarget),
        ),
      ),
    ),
);

export const insertFoodMachine = setup({
  types: {
    events: {} as Event,
  },
  actors: { inserting },
  delays: { success: 2000 },
}).createMachine({
  id: "insert-food-machine",
  initial: "Editing",
  states: {
    Editing: {
      on: {
        "food.insert": { target: "Inserting" },
      },
    },
    Inserting: {
      invoke: {
        src: "inserting",
        input: ({ event }) => {
          if (event.type === "food.insert") {
            return event;
          }

          throw new Error("Invalid event");
        },
        onError: { target: "Editing" },
        onDone: { target: "Success" },
      },
    },
    Success: {
      after: {
        success: { target: "Editing" },
      },
    },
  },
});
