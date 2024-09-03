import { versioning } from "@pglite/schema";
import { desc } from "drizzle-orm";
import { Array, Data, Effect, Layer } from "effect";
import { Migration } from "./Migration";
import { PgLite } from "./PgLite";

class ErrorVersioning extends Data.TaggedError("ErrorVersioning")<{
  error: unknown;
}> {}

const make = Effect.map(
  Effect.all({
    migrations: Migration,
    pglite: PgLite,
  }),
  ({ migrations, pglite }) => ({
    up: Effect.gen(function* () {
      const allMigrations = yield* migrations.loadAll;
      const currentVersion = allMigrations.length;
      yield* Effect.log("Current version", currentVersion);

      const clientVersion = yield* pglite
        .query((_) =>
          _.select().from(versioning).limit(1).orderBy(desc(versioning.id)),
        )
        .pipe(
          Effect.mapError((error) => new ErrorVersioning({ error })),
          Effect.flatMap(Array.head),
          Effect.map(({ id }) => id),
          Effect.orElseSucceed(() => 0),
        );

      yield* Effect.log("Client version", clientVersion);

      if (clientVersion >= currentVersion) {
        yield* Effect.log("No migrations to run");
        return clientVersion;
      }

      yield* Effect.log("Running migrations");

      for (const migration of allMigrations.slice(clientVersion)) {
        yield* Effect.log("Running migration", migration.filename);
        yield* Effect.tryPromise({
          try: () => pglite.db.exec(migration.content),
          catch: (error) => new ErrorVersioning({ error }),
        });
      }

      yield* Effect.log("Updating version", currentVersion);

      yield* pglite
        .query((_) => _.insert(versioning).values({ id: currentVersion }))
        .pipe(Effect.mapError((error) => new ErrorVersioning({ error })));

      yield* Effect.log("Migration completed 🎉");

      return currentVersion;
    }),
  }),
);

export class Versioning extends Effect.Tag("Versioning")<
  Versioning,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make).pipe(
    Layer.provide(Migration.Live),
  );
}
