import {
  integer,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const food = pgTable(
  "food",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
  },
  (_) => ({ nameIndex: uniqueIndex("name_idx").on(_.name) }),
);

export const eat = pgTable("eat", {
  id: serial("id").primaryKey(),
  foodId: integer("food_id").references(() => food.id),
  quantity: integer("quantity"),
});
