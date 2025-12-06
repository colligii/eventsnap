import { useEffect } from "react";
import { ImageCropStepProps, UseCanvaConfig } from "../types";
import { getProportion } from "../utils/getProportions";

export const useCanvaConfig = ({ canvasRef, step, originalImageSize, renderSize, cropConfig, aspect, proportions, sizeConfig, imageUrl, confirmImage }: UseCanvaConfig) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (step === 'end' && canvas && ctx && renderSize && originalImageSize.current) {

            const displayedWidth = renderSize.width * cropConfig.ratio;
            const displayedHeight = (renderSize.width / aspect) * cropConfig.ratio;

            const sx = cropConfig.startX * (originalImageSize.current.width / renderSize.width);
            const sy = cropConfig.startY * (originalImageSize.current.height / renderSize.height);

            const { maxWidth, maxHeight } = getProportion(proportions, sizeConfig)

            const widthProportion = maxWidth / displayedWidth;
            const heightProportion = maxHeight / displayedHeight;

            const proportion = Math.min(widthProportion, heightProportion);

            const sWidth = displayedWidth * proportion;
            const sHeight = displayedHeight * proportion;

            canvas.width = sWidth;
            canvas.height = sHeight;

            const img = new Image();
            img.src = imageUrl;

            ctx.drawImage(
                img,
                sx, sy,
                sWidth, sHeight,
                0, 0,
                sWidth, sHeight
            );

            canvas.toDataURL("image/png");
        }

        if (step === 'confirm' && canvas) {
            canvas.toBlob((blob) => {
                if (!blob)
                    return;

                const file = new File([blob], `${crypto.randomUUID()}.png`, { type: 'image/png' });
                confirmImage(file)
            })
        }
    }, [step])

}
