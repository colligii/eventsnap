export const getMouseOrTouchPosition = (event: React.MouseEvent | React.TouchEvent<HTMLDivElement>) => {
    return {
        clientX: 'touches' in event ? event.touches[0]?.clientX ?? 0 : event.clientX,
        clientY: 'touches' in event ? event.touches[0]?.clientY ?? 0 : event.clientY,
    }
}