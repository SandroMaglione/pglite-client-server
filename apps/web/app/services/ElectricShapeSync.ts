import { Config, Effect, Layer } from "effect";
import { PgLite } from "./PgLite";

interface ElectricShapeSyncConfig {
  readonly baseUrl: string;
}

const make = ({ baseUrl }: ElectricShapeSyncConfig) =>
  Effect.map(PgLite, ({ db }) => ({
    foo: Effect.promise(() =>
      db.electric.syncShapeToTable({
        url: `${baseUrl}/v1/shape/food`,
        table: "food",
        primaryKey: ["id"],
      }),
    ),
  }));

export class ElectricShapeSync extends Effect.Tag("ElectricShapeSync")<
  ElectricShapeSync,
  Effect.Effect.Success<ReturnType<typeof make>>
>() {
  static readonly Live = (
    config: Config.Config.Wrap<ElectricShapeSyncConfig>,
  ) => Config.unwrap(config).pipe(Effect.flatMap(make), Layer.effect(this));
}
