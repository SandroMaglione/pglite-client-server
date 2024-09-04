import { ShapeStream } from "@electric-sql/client";
import { Config, Context, Effect, Layer } from "effect";

interface ElectricSqlConfig {
  readonly baseUrl: string;
}

const make = (config: ElectricSqlConfig) =>
  // biome-ignore lint/correctness/useYield: <explanation>
  Effect.gen(function* () {
    const stream = new ShapeStream({
      url: `${config.baseUrl}/v1/shape/foo`,
    });

    return stream;
  });

export class ElectricSql extends Context.Tag("ElectricSql")<
  ElectricSql,
  Effect.Effect.Success<ReturnType<typeof make>>
>() {
  static readonly Live = (config: Config.Config.Wrap<ElectricSqlConfig>) =>
    Config.unwrap(config).pipe(Effect.flatMap(make), Layer.effect(this));
}
