import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { drizzle } from "drizzle-orm/pglite";
import { Config, Context, Data, Effect, Layer } from "effect";

interface PgLiteConfig {
  /** Required prefix `idb://` */
  readonly dataDir: string;
}

class ErrorPgLite extends Data.TaggedError("ErrorPgLite")<{
  error: unknown;
}> {}

const make = ({ dataDir }: PgLiteConfig) =>
  Effect.gen(function* () {
    const db = yield* Effect.promise(() =>
      PGlite.create({
        dataDir,
        extensions: {
          live,
        },
      }),
    );

    const client = drizzle(db);

    const query = <T>(query: string) =>
      Effect.async<T[], ErrorPgLite>((cb) => {
        db.query<T>(query)
          .then((results) => {
            cb(Effect.succeed(results.rows));
          })
          .catch((error) => {
            cb(Effect.fail(new ErrorPgLite({ error })));
          });
      });

    return { db, client, query };
  });

export class PgLite extends Context.Tag("PgLite")<
  PgLite,
  Effect.Effect.Success<ReturnType<typeof make>>
>() {
  static readonly Live = (config: Config.Config.Wrap<PgLiteConfig>) =>
    Config.unwrap(config).pipe(Effect.flatMap(make), Layer.effect(this));
}
