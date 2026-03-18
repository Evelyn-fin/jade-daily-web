CREATE TABLE `daily_quote` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_quote_date_unique` ON `daily_quote` (`date`);--> statement-breakpoint
CREATE TABLE `inspiration` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`ai_plan` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`date` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
