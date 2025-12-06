import { RefObject } from "react";
import { CropConfig, IncreaseStr, RenderImageSize } from "../types";

export const calculateCropConfig = ({ data, mouseX, mouseY, width, height, renderSize, aspect, resizeDownRef }: CalculateProps ) => {
    let newWidth = null
    let newHeight = null
    let finalLeft = data.startX;
    let finalTop = data.startY;

    if (resizeDownRef.current === "bottom-right") {

        newWidth = mouseX - data.startX + 6;
        newHeight = mouseY - data.startY + 6;

    } else if (resizeDownRef.current === "bottom-left") {

        newHeight = mouseY - data.startY + 6;
        const leftDiff = mouseX - data.startX;
        newWidth = width - leftDiff;

        finalLeft = data.startX + leftDiff;

    } else if (resizeDownRef.current === 'top-right') {

        newWidth = mouseX - data.startX + 6;
        const topDiff = mouseY - data.startY;
        newHeight = (topDiff * -1) + height;


    } else if (resizeDownRef.current === 'top-left') {

        const leftDiff = mouseX - data.startX;
        newWidth = width - leftDiff;
        const topDiff = mouseY - data.startY;
        newHeight = (topDiff * -1) + height;

    } else return data;

    const ratio = Math.max(
        newWidth / renderSize.width,
        newHeight / (renderSize.width / aspect),
    );

    if (resizeDownRef.current === 'top-right' || resizeDownRef.current === 'top-left') {
        const oldBottomToTopDistance = data.startY + height;
        finalTop = oldBottomToTopDistance - (renderSize.width / aspect * ratio);

        if (resizeDownRef.current === 'top-left') {
            const leftToEndDiff = data.startX + width;
            finalLeft = leftToEndDiff - (renderSize.width * ratio)
        }
    }

    const realWidth = (renderSize.width * ratio),
        realHeight = (renderSize.width / aspect * ratio);

    if (finalLeft < 0 || finalTop < 0 || realHeight + finalTop > renderSize.height || realWidth + finalLeft > renderSize.width)
        return data;

    return { ...data, ratio: Math.min(1, ratio), startX: finalLeft, startY: finalTop }
}

export interface CalculateProps {
    data: CropConfig,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
    renderSize: RenderImageSize,
    aspect: number,
    resizeDownRef: RefObject<IncreaseStr | null>
}