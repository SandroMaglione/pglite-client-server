import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { database } from "@pglite/schema";
import type { Query } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { Config, Context, Data, Effect, Layer } from "effect";
import { ElectricSync } from "./ElectricSync";

interface PgLiteConfig {
  /** Required prefix `idb://` */
  readonly dataDir: string;
}

class ErrorPgLite extends Data.TaggedError("ErrorPgLite")<{
  error: unknown;
}> {}

const make = ({ dataDir }: PgLiteConfig) =>
  Effect.flatMap(ElectricSync, (electric) =>
    Effect.gen(function* () {
      const db = yield* Effect.promise(() =>
        PGlite.create({
          dataDir,
          extensions: {
            electric,
            live,
          },
        }),
      );

      const drizzleClient = drizzle(db, { schema: database });

      const rawQuery = (
        execute: (client: typeof drizzleClient) => { toSQL(): Query },
      ): string => execute(drizzleClient).toSQL().sql;

      const query = <T>(
        execute: (client: typeof drizzleClient) => Promise<T>,
      ) =>
        Effect.async<T, ErrorPgLite>((cb) => {
          execute(drizzleClient)
            .then((result) => {
              cb(Effect.succeed(result));
            })
            .catch((error) => {
              cb(Effect.fail(new ErrorPgLite({ error })));
            });
        });

      return { db, query, rawQuery };
    }),
  );

export class PgLite extends Context.Tag("PgLite")<
  PgLite,
  Effect.Effect.Success<ReturnType<typeof make>>
>() {
  static readonly Live = (config: Config.Config.Wrap<PgLiteConfig>) =>
    Config.unwrap(config).pipe(
      Effect.flatMap(make),
      Layer.effect(this),
      Layer.provide(ElectricSync.Live),
    );
}
