import { fromPromise, setup } from "xstate";
import { RuntimeClient } from "~/services/RuntimeClient";
import { Versioning } from "~/services/Versioning";

const migration = fromPromise(() => RuntimeClient.runPromise(Versioning.up));

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
