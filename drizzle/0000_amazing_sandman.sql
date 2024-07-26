DO $$ BEGIN
 CREATE TYPE "public"."entity_type" AS ENUM('people', 'planets', 'starships', 'vehicles', 'films', 'species');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_overrides" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_id" serial NOT NULL,
	"custom_data" jsonb NOT NULL,
	"created" timestamp DEFAULT now(),
	"edited" timestamp DEFAULT now()
);
