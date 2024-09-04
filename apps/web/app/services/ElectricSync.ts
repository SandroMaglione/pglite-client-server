import { electricSync } from "@electric-sql/pglite-sync";
import { Context, Effect, Layer } from "effect";

const make = Effect.sync(() => electricSync());

export class ElectricSync extends Context.Tag("ElectricSync")<
  ElectricSync,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make);
}
