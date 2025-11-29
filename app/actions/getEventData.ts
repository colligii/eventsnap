"use server"
import { db } from '@/db/drizzle'
import { event } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export const getEventData = async (id: string) => {
    try {
        const searchEvent = await db.query.event.findFirst({
            where: eq(event.id, id)
        })

        if (!searchEvent)
            redirect('/not-found')

        return searchEvent
    } catch(e) {
        redirect('/error')
    }
}