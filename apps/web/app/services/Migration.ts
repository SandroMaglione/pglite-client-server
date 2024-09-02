import { Schema } from "@effect/schema";
import {
  Array,
  Data,
  Effect,
  Layer,
  Order,
  Record,
  String,
  pipe,
} from "effect";

const MigrationGlob = Schema.Record({
  key: Schema.String,
  value: Schema.Struct({ default: Schema.String }),
});

class ErrorMigration extends Data.TaggedError("ErrorMigration")<{
  error: unknown;
}> {}

const make = {
  loadAll: Effect.gen(function* () {
    const migrations = import.meta.glob("@/migrations/*.sql", {
      eager: true,
      query: "?raw",
    });

    const migrationsFiles = yield* Schema.decodeUnknown(MigrationGlob)(
      migrations,
    ).pipe(Effect.mapError((error) => new ErrorMigration({ error })));

    const migrationFiles = pipe(
      migrationsFiles,
      Record.toEntries,
      Array.map(([filename, data]) => ({
        filename,
        content: data.default,
      })),
      Array.sortBy(Order.mapInput(String.Order, ({ filename }) => filename)),
    );

    return yield* Effect.liftPredicate(
      migrationFiles,
      Array.isNonEmptyArray,
      () => new ErrorMigration({ error: new Error("No migrations") }),
    );
  }),
};

export class Migration extends Effect.Tag("Migration")<
  Migration,
  typeof make
>() {
  static readonly Live = Layer.succeed(this, make);
}
