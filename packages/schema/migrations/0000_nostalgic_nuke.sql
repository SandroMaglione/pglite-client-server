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