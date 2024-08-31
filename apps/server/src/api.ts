import { HttpApiBuilder } from "@effect/platform";
import { MyApi } from "@pglite/api";
import { Effect, Layer } from "effect";

const DbSchemaApiLive = HttpApiBuilder.group(MyApi, "db", (handlers) =>
  handlers.pipe(
    HttpApiBuilder.handle("latestMigration", () =>
      Effect.succeed(`
                    CREATE TABLE IF NOT EXISTS "eat" (
                "id" serial PRIMARY KEY NOT NULL,
                "food_id" integer,
                "quantity" integer
            );
            --> statement-breakpoint
            CREATE TABLE IF NOT EXISTS "food" (
                "id" serial PRIMARY KEY NOT NULL,
                "name" varchar(256)
            );
            --> statement-breakpoint
            DO $$ BEGIN
             ALTER TABLE "eat" ADD CONSTRAINT "eat_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
            EXCEPTION
             WHEN duplicate_object THEN null;
            END $$;
            --> statement-breakpoint
            CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "food" USING btree ("name");
                    `),
    ),
  ),
);

export const MyApiLive = HttpApiBuilder.api(MyApi).pipe(
  Layer.provide(DbSchemaApiLive),
);
