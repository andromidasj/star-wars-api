CREATE TABLE IF NOT EXISTS "characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"home_planet_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "characters_to_ships" (
	"character_id" integer NOT NULL,
	"ship_id" integer NOT NULL,
	CONSTRAINT "characters_to_ships_character_id_ship_id_pk" PRIMARY KEY("character_id","ship_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "planets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"climate" text,
	"population" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ships" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"model" text,
	"cost_in_credits" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters" ADD CONSTRAINT "characters_home_planet_id_planets_id_fk" FOREIGN KEY ("home_planet_id") REFERENCES "public"."planets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
