import { Schema } from "@effect/schema";
import { Effect } from "effect";
import { fromPromise, setup } from "xstate";
import { ApiDatabase } from "~/services/ApiDatabase";
import { FormData } from "~/services/FormData";
import { RuntimeClient } from "~/services/RuntimeClient";

type Event = {
  type: "serving.add";
  formEvent: React.FormEvent<HTMLFormElement>;
};

const adding = fromPromise(
  ({ input }: { input: { formEvent: React.FormEvent<HTMLFormElement> } }) =>
    RuntimeClient.runPromise(
      Effect.gen(function* () {
        input.formEvent.preventDefault();
        const servingAdd = yield* FormData.fromSchema(
          Schema.Struct({
            foodId: Schema.NumberFromString,
            quantity: Schema.NumberFromString,
          }),
        );

        return yield* ApiDatabase.addServing({
          food_id: servingAdd.foodId,
          quantity: servingAdd.quantity,
        });
      }).pipe(
        Effect.provideService(
          FormData,
          new globalThis.FormData(input.formEvent.currentTarget),
        ),
      ),
    ),
);

export const addServingMachine = setup({
  types: {
    events: {} as Event,
  },
  actors: { adding },
  delays: { success: 2000 },
}).createMachine({
  id: "add-serving-machine",
  initial: "Editing",
  states: {
    Editing: {
      on: {
        "serving.add": { target: "Adding" },
      },
    },
    Adding: {
      invoke: {
        src: "adding",
        input: ({ event }) => {
          if (event.type === "serving.add") {
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
