ALTER TABLE "eat" RENAME TO "serving";--> statement-breakpoint
ALTER TABLE "serving" DROP CONSTRAINT "eat_food_id_food_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serving" ADD CONSTRAINT "serving_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
