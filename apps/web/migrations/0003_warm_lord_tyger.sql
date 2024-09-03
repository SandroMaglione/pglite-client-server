ALTER TABLE "food" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "serving" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "food" ADD COLUMN "calories" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "food" ADD COLUMN "fat" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "food" ADD COLUMN "carbohydrate" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "food" ADD COLUMN "protein" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "food" ADD COLUMN "sugar" integer;--> statement-breakpoint
ALTER TABLE "food" ADD COLUMN "fiber" integer;--> statement-breakpoint
ALTER TABLE "food" ADD COLUMN "salt" integer;--> statement-breakpoint
ALTER TABLE "food" ADD COLUMN "saturated_fat" integer;