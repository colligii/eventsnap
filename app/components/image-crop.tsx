import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";

export const ImageCrop = ({ file, width, aspect }: ImageCropProps) => {

    const [cropConfig, setCropConfig] = useState<CropConfig>({ ratio: 0.3, startX: 0, startY: 0 })
    const [renderSize, setRenderSize] = useState<RenderImageSize | null>(null)

    const resizeDownRef = useRef<IncreaseStr | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const positionMouseDownRef = useRef<boolean>(false);
    const oldMouse = useRef<OldMouse | null>(null);

    const imageUrl = useMemo(() => {
        return URL.createObjectURL(file)
    }, [file]);

    useEffect(() => {
        document.body.addEventListener('mouseup', handleAllMouseUp);
        return () => document.body.removeEventListener('mouseup', handleAllMouseUp);
    }, [])

    const handleImgLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        const imgElem = event.target as HTMLImageElement;
        setRenderSize({ width: imgElem.width, height: imgElem.height });
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

    const handleAllMouseUp = () => {
        oldMouse.current = null;
        resizeDownRef.current = null;
        positionMouseDownRef.current = false;
    }


    const handleMouseDownUp = (event: React.MouseEvent) => {
        if (!renderSize)
            return;

        const div = event.target as HTMLDivElement;
        const rect = div.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

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

            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            setCropConfig(data => {
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

                if (finalLeft < 0 || finalTop < 0 || (newHeight + finalTop) > renderSize.width || (newWidth + finalLeft) > renderSize.height)
                    return data;


                return { ...data, ratio: Math.min(1, ratio), startX: finalLeft, startY: finalTop }
            });
        }



    }

    const imgHeight = Math.floor(width / aspect);

    return (
        <div
            className="relative overflow-hidden"
            draggable={false}
            ref={wrapperRef}
            onMouseDown={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onMouseMove={handleMouseDownUp}
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
                            ></div>
                            <div
                                className="absolute right-0 top-0 border-r-3 border-t-3 border-white w-4 h-4 z-30 hover:cursor-sw-resize"
                                onMouseDown={handleResizeDown('top-right')}
                            ></div>
                            <div
                                className="absolute left-0 bottom-0 border-l-3 border-b-3 border-white w-4 h-4 z-30 hover:cursor-ne-resize"
                                onMouseDown={handleResizeDown('bottom-left')}
                            ></div>
                            <div className="absolute right-0 bottom-0 border-r-3 border-b-3 border-white w-4 h-4 z-30 hover:cursor-nw-resize"
                                onMouseDown={handleResizeDown('bottom-right')}
                            ></div>
                            <img
                                className="relative z-10 max-w-max"

                                onMouseDown={handlePositionMouseDown}
                                onMouseUp={handlePositionMouseUpOut}
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
                className="object-cover relative z-10 max-w-max"
                style={{ height: `${imgHeight}px` }}
                src={imageUrl}
                onLoad={handleImgLoad}
                alt="Image to crop"
            ></img>
        </div>
    )
}

export interface OldMouse {
    top: number;
    left: number
}

export interface ImageCropProps {
    file: File,
    width: number;
    aspect: number;
}

export interface RenderImageSize {
    width: number;
    height: number;
}

export interface CropConfig {
    ratio: number;
    startX: number;
    startY: number;

}

export type IncreaseStr = 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';