ALTER TABLE "added_entities" ADD CONSTRAINT "added_entities_entity_id_unique" UNIQUE("entity_id");--> statement-breakpoint
ALTER TABLE "deleted_entities" ADD CONSTRAINT "deleted_entities_entity_id_unique" UNIQUE("entity_id");--> statement-breakpoint
ALTER TABLE "edited_entities" ADD CONSTRAINT "edited_entities_entity_id_unique" UNIQUE("entity_id");