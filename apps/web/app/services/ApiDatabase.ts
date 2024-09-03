import { food } from "@pglite/schema";
import { Context, Effect, Layer } from "effect";
import type { NoId } from "~/types";
import { PgLite } from "./PgLite";

const make = Effect.map(PgLite, ({ query }) => ({
  addFood: (foodInsert: NoId<typeof food.$inferInsert>) =>
    query((_) => _.insert(food).values(foodInsert)),
}));

export class ApiDatabase extends Context.Tag("ApiDatabase")<
  ApiDatabase,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make);
}