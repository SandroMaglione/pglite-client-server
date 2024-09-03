import { food, serving } from "@pglite/schema";
import { Effect, Layer } from "effect";
import type { NoId } from "~/types";
import { PgLite } from "./PgLite";

const make = Effect.map(PgLite, ({ query }) => ({
  addFood: (foodInsert: NoId<typeof food.$inferInsert>) =>
    query((_) => _.insert(food).values(foodInsert)),

  addServing: (servingInsert: NoId<typeof serving.$inferInsert>) =>
    query((_) => _.insert(serving).values(servingInsert)),
}));

export class ApiDatabase extends Effect.Tag("ApiDatabase")<
  ApiDatabase,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make);
}
