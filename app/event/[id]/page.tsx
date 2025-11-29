import { getEventData } from "@/app/actions/getEventData"

export default async function Event({ params }: EventProps) {
    const { id } = await params;
    const event = await getEventData(id);

    return <h1>{event.name}</h1>
}

export interface EventProps { params: Promise<{ id: string }> }