import { RefObject, useEffect } from "react";
import { OriginalImageSize } from "../types";

export const useResizer = (originalImageSize: RefObject<OriginalImageSize | null>, calculateProps: () => void) => {
    useEffect(() => {
        const el = document.body;
        if (!el) return;

        const observer = new ResizeObserver(() => {
            if (originalImageSize.current)
                calculateProps();
        })

        observer.observe(el);

        return () => observer.disconnect();
    }, [])
}