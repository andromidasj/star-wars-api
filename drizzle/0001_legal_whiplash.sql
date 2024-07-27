CREATE TABLE IF NOT EXISTS "deleted_entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_id" integer NOT NULL,
	"created" timestamp DEFAULT now(),
	"edited" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "entity_overrides" ALTER COLUMN "entity_id" SET DATA TYPE integer;