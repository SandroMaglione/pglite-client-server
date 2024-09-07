import { Config, Data, Effect, Layer } from "effect";
import { PgLite } from "./PgLite";

interface ElectricShapeSyncConfig {
  readonly baseUrl: string;
}

class ErrorSyncShape extends Data.TaggedError("ErrorSyncShape")<{
  error: unknown;
}> {}

const make = ({ baseUrl }: ElectricShapeSyncConfig) =>
  Effect.map(PgLite, ({ db }) => ({
    food: Effect.tryPromise({
      try: () =>
        db.electric.syncShapeToTable({
          url: `${baseUrl}/v1/shape/food`,
          table: "food",
          primaryKey: ["id"],
        }),
      catch: (error) => new ErrorSyncShape({ error }),
    }),
  }));

export class ElectricShapeSync extends Effect.Tag("ElectricShapeSync")<
  ElectricShapeSync,
  Effect.Effect.Success<ReturnType<typeof make>>
>() {
  static readonly Live = (
    config: Config.Config.Wrap<ElectricShapeSyncConfig>,
  ) => Config.unwrap(config).pipe(Effect.flatMap(make), Layer.effect(this));
}
