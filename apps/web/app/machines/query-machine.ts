import { food } from "@pglite/schema";
import { Console, Effect } from "effect";
import { assign, fromPromise, setup } from "xstate";
import { PgLite } from "~/services/PgLite";
import { RuntimeClient } from "~/services/RuntimeClient";

type Food = typeof food.$inferSelect;

type Event = { type: "food.insert" } | { type: "food.input"; name: string };

const reloading = fromPromise(() =>
  RuntimeClient.runPromise(
    Effect.gen(function* () {
      const { client } = yield* PgLite;
      return yield* Effect.promise(() => client.select().from(food).execute());
    }).pipe(
      Effect.tapError((error) => Console.log(JSON.stringify(error, null, 2))),
    ),
  ),
);

const inserting = fromPromise(
  ({ input: { name } }: { input: { name: string } }) =>
    RuntimeClient.runPromise(
      Effect.gen(function* () {
        const { client } = yield* PgLite;
        return yield* Effect.promise(() =>
          client.insert(food).values({ name }),
        );
      }),
    ),
);

export const machine = setup({
  types: {
    events: {} as Event,
    context: {} as { foods: Food[]; name: string },
  },
  actors: { reloading, inserting },
}).createMachine({
  id: "query-machine",
  context: { foods: [], name: "" },
  initial: "Reloading",
  states: {
    Reloading: {
      invoke: {
        src: "reloading",
        onError: "Idle",
        onDone: {
          target: "Idle",
          actions: assign(({ event }) => ({ foods: event.output, task: "" })),
        },
      },
    },
    Idle: {
      on: {
        "food.input": {
          actions: assign(({ event }) => ({ name: event.name })),
        },
        "food.insert": { target: "Inserting" },
      },
    },
    Inserting: {
      invoke: {
        src: "inserting",
        input: ({ context }) => ({ name: context.name }),
        onDone: { target: "Reloading" },
      },
    },
  },
});
