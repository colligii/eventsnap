import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, text, boolean } from "drizzle-orm/pg-core";

export const event = pgTable('event', {
    id: uuid().primaryKey(),
    name: varchar({length: 50}).notNull(),
    backgroundSm: uuid(),
})

export const eventRelations = relations(event, ({ one }) => ({
    background_sm: one(file, {
        fields: [event.backgroundSm],
        references: [file.id]
    })
}))

export const file = pgTable('files', {
    id: uuid().primaryKey(),
    path: text(),
    isPublic: boolean()
})