import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const event = pgTable('event', {
    id: uuid().primaryKey(),
    name: varchar({length: 50}).notNull()
})