CREATE TABLE IF NOT EXISTS "food" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"calories" integer NOT NULL,
	"fat" integer NOT NULL,
	"carbohydrate" integer NOT NULL,
	"protein" integer NOT NULL,
	"sugar" integer,
	"fiber" integer,
	"salt" integer,
	"saturated_fat" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "serving" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_id" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "versioning" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serving" ADD CONSTRAINT "serving_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "food" USING btree ("name");