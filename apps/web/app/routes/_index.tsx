import { useMachine } from "@xstate/react";
import { machine as dbMachine } from "~/machines/db-machine";
import { machine } from "~/machines/query-machine";

export default function Index() {
  const [snapshot, send] = useMachine(machine);
  const [dbSnapshot, dbSend] = useMachine(dbMachine);
  return (
    <main>
      {dbSnapshot.matches("Migrating") && <p>Migrating...</p>}
      {dbSnapshot.matches("MigrationError") && <p>Migration error</p>}
      <button
        type="button"
        onClick={() => dbSend({ type: "migration.execute" })}
      >
        Execute migration
      </button>

      {snapshot.matches("Reloading") && <p>Reloading...</p>}
      {snapshot.matches("Inserting") ? (
        <p>Inserting...</p>
      ) : (
        <div>
          <input
            type="text"
            value={snapshot.context.name}
            onChange={(e) => send({ type: "food.input", name: e.target.value })}
          />
          <button type="button" onClick={() => send({ type: "food.insert" })}>
            Insert
          </button>
        </div>
      )}
      <pre>{JSON.stringify(snapshot.context.foods, null, 2)}</pre>
    </main>
  );
}
