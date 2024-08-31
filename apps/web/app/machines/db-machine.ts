import { Effect } from "effect";
import { fromPromise, setup } from "xstate";
import { ApiClient } from "~/services/ApiClient";
import { PgLite } from "~/services/PgLite";
import { RuntimeClient } from "~/services/RuntimeClient";

const migration = fromPromise(() =>
  RuntimeClient.runPromise(
    Effect.gen(function* () {
      const { client } = yield* ApiClient;
      const { db } = yield* PgLite;
      const migration = yield* client.db.latestMigration();
      yield* Effect.promise(() => db.exec(migration));
    }),
  ),
);

export const machine = setup({
  types: {
    events: {} as { type: "migration.execute" },
  },
  actors: { migration },
}).createMachine({
  id: "db-machine",
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "migration.execute": { target: "Migrating" },
      },
    },
    Migrating: {
      invoke: {
        src: "migration",
        onError: "MigrationError",
        onDone: "Idle",
      },
    },
    MigrationError: {},
  },
});
