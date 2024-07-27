CREATE TABLE IF NOT EXISTS "added_entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_id" integer NOT NULL,
	"entity_data" jsonb NOT NULL,
	"created" timestamp DEFAULT now(),
	"edited" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "entity_overrides" RENAME TO "edited_entities";--> statement-breakpoint
ALTER TABLE "edited_entities" RENAME COLUMN "custom_data" TO "updated_data";