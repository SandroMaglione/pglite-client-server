import {
  integer,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const versioning = pgTable("versioning", {
  id: serial("id").primaryKey(),
});

export const food = pgTable(
  "food",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    calories: integer("calories").notNull(),
    fat: integer("fat").notNull(),
    carbohydrate: integer("carbohydrate").notNull(),
    protein: integer("protein").notNull(),
    sugar: integer("sugar"),
    fiber: integer("fiber"),
    salt: integer("salt"),
    saturated_fat: integer("saturated_fat"),
  },
  (_) => ({ nameIndex: uniqueIndex("name_idx").on(_.name) }),
);

export const serving = pgTable("serving", {
  id: serial("id").primaryKey(),
  foodId: integer("food_id").references(() => food.id),
  quantity: integer("quantity").notNull(),
});

export const database = { food, serving, versioning };
