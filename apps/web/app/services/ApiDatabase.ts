import { food } from "@pglite/schema";
import { desc } from "drizzle-orm";
import { Effect, Layer } from "effect";
import type { NoId } from "~/types";
import { PgLite } from "./PgLite";

const make = Effect.map(PgLite, ({ query }) => ({
  addFood: (foodInsert: NoId<typeof food.$inferInsert>) =>
    query((_) => _.insert(food).values(foodInsert)),

  getAllFoods: query((_) =>
    _.select().from(food).orderBy(desc(food.id)).execute(),
  ),
}));

export class ApiDatabase extends Effect.Tag("ApiDatabase")<
  ApiDatabase,
  Effect.Effect.Success<typeof make>
>() {
  static readonly Live = Layer.effect(this, make);
}
