ALTER TABLE "characters" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "planets" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "planets" ALTER COLUMN "climate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "planets" ALTER COLUMN "population" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ships" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ships" ALTER COLUMN "model" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ships" ALTER COLUMN "cost_in_credits" SET NOT NULL;