import { useEffect } from "react";

export const useManageMouseTouchUpAndDownEvent = (handleAllMouseUp: () => void) => {
    useEffect(() => {
            document.body.addEventListener('mouseup', handleAllMouseUp);
            document.body.addEventListener('touchend', handleAllMouseUp);
            return () => {
                document.body.removeEventListener('touchend', handleAllMouseUp);
                document.body.removeEventListener('mouseup', handleAllMouseUp);
            }
        }, [])
}