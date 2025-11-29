CREATE TABLE "files" (
	"id" uuid PRIMARY KEY NOT NULL,
	"path" text,
	"isPublic" boolean
);
--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "backgroundSm" uuid;