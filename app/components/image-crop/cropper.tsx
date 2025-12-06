import { Dispatch, RefObject, SetStateAction, SyntheticEvent, useMemo, useRef, useState } from "react";
import { ConfirmImageFunction, CropConfig, ImageCropStepProps, IncreaseStr, OldMouse, OriginalImageSize, Proportions, RenderImageSize, SizeConfig } from "./types";
import { getProportion } from "./utils/getProportions";
import { useManageMouseTouchUpAndDownEvent } from "./hooks/manageMouseTouchUpAndDownEvent";
import { useResizer } from "./hooks/useResizer";
import { useCanvaConfig } from "./hooks/useCanvaConfig";
import { getMouseOrTouchPosition } from "./utils/getMouseOrTouchPostion";
import { calculateCropConfig } from "./utils/calculateCropConfig";

export default function Cropper({ imageUrl, proportions, sizeConfig, aspect, step, confirmImage, cropConfig, setCropConfig, renderSize, setRenderSize, originalImageSize }: CropperProps) {

    
    const resizeDownRef = useRef<IncreaseStr | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const positionMouseDownRef = useRef<boolean>(false);
    const oldMouse = useRef<OldMouse | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleAllMouseUp = () => {
        oldMouse.current = null;
        resizeDownRef.current = null;
        positionMouseDownRef.current = false;
    }

    const calculateProps = () => {
        const imgSize = originalImageSize.current;

        if (!imgSize)
            throw Error("image size is not loaded");

        const { maxWidth, maxHeight } = getProportion(proportions, sizeConfig);

        const widthProportion = maxWidth / imgSize.width;
        const heightProportion = maxHeight / imgSize.height;

        const proportion = Math.min(widthProportion, heightProportion);

        setRenderSize({ width: imgSize.width * proportion, height: imgSize.height * proportion });
    }

    useManageMouseTouchUpAndDownEvent(handleAllMouseUp)
    useResizer(originalImageSize, calculateProps)
    useCanvaConfig({
        aspect,
        canvasRef,
        confirmImage,
        cropConfig,
        imageUrl,
        originalImageSize,
        proportions,
        renderSize,
        sizeConfig,
        step
    })

    const handleImgLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        const imgElem = event.target as HTMLImageElement;
        setRenderSize({ width: imgElem.width, height: imgElem.height });
    }

    const handleImgSize = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        const imgElem = event.target as HTMLImageElement;
        originalImageSize.current = { width: imgElem.width, height: imgElem.height };

        calculateProps();

    }

    const handlePositionMouseDown = () => {
        positionMouseDownRef.current = true;
    }

    const handlePositionMouseUpOut = () => {
        oldMouse.current = null;
        positionMouseDownRef.current = false;
    }

    const handleResizeDown = (type: IncreaseStr) => {
        return () => {
            resizeDownRef.current = type
        };
    }

    const handleMouseDownUp = (event: React.MouseEvent | React.TouchEvent<HTMLDivElement>) => {
        if (!renderSize)
            return;

        const div = event.target as HTMLDivElement;
        const rect = div.getBoundingClientRect();

        const { clientX, clientY } = getMouseOrTouchPosition(event);

        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        const width = renderSize.width * cropConfig.ratio;
        const height = renderSize.width / aspect * cropConfig.ratio;

        if (positionMouseDownRef.current) {
            if (!oldMouse.current) {
                oldMouse.current = { top: mouseY, left: mouseX }
                return;
            }

            const diffMouseLeft = mouseX - oldMouse.current.left;
            const diffMouseTop = mouseY - oldMouse.current.top;

            const left = Math.max(0, Math.min(renderSize.width - width, cropConfig.startX + diffMouseLeft));
            const top = Math.max(0, Math.min(renderSize.height - height, cropConfig.startY + diffMouseTop));

            oldMouse.current = { top: mouseY, left: mouseX }

            setCropConfig(data => ({ ...data, startX: left, startY: top }))
        } else if (resizeDownRef.current) {
            const rect = wrapperRef.current!.getBoundingClientRect();

            const { clientX, clientY } = getMouseOrTouchPosition(event);
            const mouseX = clientX - rect.left;
            const mouseY = clientY - rect.top;

            setCropConfig((data) => {
                return calculateCropConfig({
                    data,
                    aspect,
                    height,
                    mouseX,
                    mouseY,
                    renderSize,
                    resizeDownRef,
                    width
                })  
            });
        }

    }

    if (step === 'selecting') {
        if (!renderSize) {
            return <img src={imageUrl} onLoad={handleImgSize} alt="Image to crop" className="hidden w-24" />
        }

        return (
            <div
                className="relative overflow-hidden w-full h-full"
                draggable={false}
                ref={wrapperRef}
                onMouseDown={(e) => e.preventDefault()}
                onTouchStart={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onMouseMove={handleMouseDownUp}
                onTouchMove={handleMouseDownUp}
            >
                {renderSize && (
                    <>
                        <div
                            className="z-20 absolute"
                            style={{
                                background: 'rgba(0,0,0,0.7)',
                                width: renderSize.width + 'px',
                                height: renderSize.height + 'px',
                            }}
                        ></div>
                        <div
                            className="z-30 absolute"
                            style={{
                                width: (renderSize.width * cropConfig.ratio) + 'px',
                                height: (renderSize.width / aspect * cropConfig.ratio) + 'px',
                                top: cropConfig.startY + 'px',
                                left: cropConfig.startX + 'px',
                            }}
                        >
                            <div
                                className="overflow-hidden relative w-full h-full active:cursor-grab"
                            >
                                <div
                                    className="absolute left-0 top-0 border-l-3 border-t-3 border-white w-4 h-4 z-30 hover:cursor-se-resize"
                                    onMouseDown={handleResizeDown('top-left')}
                                    onTouchStart={handleResizeDown('top-left')}
                                ></div>
                                <div
                                    className="absolute right-0 top-0 border-r-3 border-t-3 border-white w-4 h-4 z-30 hover:cursor-sw-resize"
                                    onMouseDown={handleResizeDown('top-right')}
                                    onTouchStart={handleResizeDown('top-right')}
                                ></div>
                                <div
                                    className="absolute left-0 bottom-0 border-l-3 border-b-3 border-white w-4 h-4 z-30 hover:cursor-ne-resize"
                                    onMouseDown={handleResizeDown('bottom-left')}
                                    onTouchStart={handleResizeDown('bottom-left')}
                                ></div>
                                <div className="absolute right-0 bottom-0 border-r-3 border-b-3 border-white w-4 h-4 z-30 hover:cursor-nw-resize"
                                    onMouseDown={handleResizeDown('bottom-right')}
                                    onTouchStart={handleResizeDown('bottom-right')}
                                ></div>
                                <img
                                    className="relative z-10 max-w-max"

                                    onMouseDown={handlePositionMouseDown}
                                    onTouchStart={handlePositionMouseDown}
                                    onMouseUp={handlePositionMouseUpOut}
                                    onTouchEnd={handlePositionMouseUpOut}
                                    style={{
                                        top: '-' + cropConfig.startY + 'px',
                                        left: '-' + cropConfig.startX + 'px',
                                    }}
                                    width={renderSize.width}
                                    height={renderSize.height}
                                    src={imageUrl}
                                    alt="Image to crop"
                                ></img>
                            </div>
                        </div>

                    </>
                )}
                <img
                    className="object-cover relative z-10 min-w-full"
                    style={{ minWidth: renderSize.width, minHeight: renderSize.height }}
                    width={renderSize.width}
                    height={renderSize.height}
                    src={imageUrl}
                    onLoad={handleImgLoad}
                    alt="Image to crop"
                ></img>
            </div>
        )
    }

}

export interface CropperProps {
    imageUrl: string;
    proportions: Proportions;
    sizeConfig: SizeConfig;
    aspect: number;
    step: ImageCropStepProps;
    confirmImage: ConfirmImageFunction;
    cropConfig: CropConfig;
    setCropConfig: Dispatch<SetStateAction<CropConfig>>;
    renderSize: RenderImageSize | null;
    setRenderSize: Dispatch<SetStateAction<RenderImageSize | null>>;
    originalImageSize: RefObject<OriginalImageSize | null>
}