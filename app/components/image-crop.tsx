import { randomUUID } from "crypto";
import { SyntheticEvent, TouchEventHandler, useEffect, useMemo, useRef, useState } from "react";

export const ImageCrop = ({ file, aspect, proportions, sizeConfig, step, confirmImage }: ImageCropProps) => {

    const [cropConfig, setCropConfig] = useState<CropConfig>({ ratio: 0.2, startX: 0, startY: 0 })
    const [renderSize, setRenderSize] = useState<RenderImageSize | null>(null);

    const resizeDownRef = useRef<IncreaseStr | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const positionMouseDownRef = useRef<boolean>(false);
    const oldMouse = useRef<OldMouse | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const originalImageSize = useRef<OriginalImageSize>(null);

    const imageUrl = useMemo(() => {
        return URL.createObjectURL(file)
    }, [file]);

    useEffect(() => {
        document.body.addEventListener('mouseup', handleAllMouseUp);
        document.body.addEventListener('touchend', handleAllMouseUp);
        return () => {
            document.body.removeEventListener('touchend', handleAllMouseUp);
            document.body.removeEventListener('mouseup', handleAllMouseUp);
        }
    }, [])

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

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (step === 'end' && canvas && ctx && renderSize && originalImageSize.current) {

            const displayedWidth = renderSize.width * cropConfig.ratio;
            const displayedHeight = (renderSize.width / aspect) * cropConfig.ratio;
    
            const sx = cropConfig.startX * (originalImageSize.current.width / renderSize.width);
            const sy = cropConfig.startY * (originalImageSize.current.height / renderSize.height);
    
            const rightProportion = Object.entries(proportions).find(([key, value]: [string, (size: number) => boolean]) => {
                return value(document.body.clientWidth)
            })
    
            if (!rightProportion)
                throw Error('Not proportion find for this screen');
    
            const maxWidth = sizeConfig[rightProportion[0]].maxWidth;
            const maxHeight = sizeConfig[rightProportion[0]].maxHeight;
    
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

        console.log(step, canvas)

        if(step === 'confirm' && canvas) {
            canvas.toBlob((blob) => {
                if(!blob)
                    return;

                const file = new File([blob], `${crypto.randomUUID()}.png`, { type: 'image/png' });
                confirmImage(file)
            })
        }
    }, [step])

    const handleImgLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        const imgElem = event.target as HTMLImageElement;
        setRenderSize({ width: imgElem.width, height: imgElem.height });
    }

    const calculateProps = () => {
        const rightProportion = Object.entries(proportions).find(([key, value]: [string, (size: number) => boolean]) => {
            return value(document.body.clientWidth)
        })

        const imgSize = originalImageSize.current;

        if (!imgSize)
            throw Error("image size is not loaded");

        if (!rightProportion)
            throw Error('Not proportion find for this screen');

        const maxWidth = sizeConfig[rightProportion[0]].maxWidth;
        const maxHeight = sizeConfig[rightProportion[0]].maxHeight;

        const widthProportion = maxWidth / imgSize.width;
        const heightProportion = maxHeight / imgSize.height;

        const proportion = Math.min(widthProportion, heightProportion);

        setRenderSize({ width: imgSize.width * proportion, height: imgSize.height * proportion });
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

    const handleAllMouseUp = () => {
        oldMouse.current = null;
        resizeDownRef.current = null;
        positionMouseDownRef.current = false;
    }

    const handleMouseDownUp = (event: React.MouseEvent | React.TouchEvent<HTMLDivElement>) => {
        if (!renderSize)
            return;

        const div = event.target as HTMLDivElement;
        const rect = div.getBoundingClientRect();

        const clientX = 'touches' in event ? event.touches[0]?.clientX ?? 0 : event.clientX;
        const clientY = 'touches' in event ? event.touches[0]?.clientY ?? 0 : event.clientY;
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

            const clientX = 'touches' in event ? event.touches[0]?.clientX ?? 0 : event.clientX;
            const clientY = 'touches' in event ? event.touches[0]?.clientY ?? 0 : event.clientY;
            const mouseX = clientX - rect.left;
            const mouseY = clientY - rect.top;

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

                const realWidth = (renderSize.width * ratio),
                    realHeight = (renderSize.width / aspect * ratio);

                if (finalLeft < 0 || finalTop < 0 || realHeight + finalTop > renderSize.height || realWidth + finalLeft > renderSize.width)
                    return data;

                return { ...data, ratio: Math.min(1, ratio), startX: finalLeft, startY: finalTop }
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

    if ((step === 'end' || step === 'confirm') && imageUrl) {
        return <canvas
            ref={canvasRef}
        >

        </canvas>
    }

    return <h1>Some error hapened :(</h1>
}

export interface OldMouse {
    top: number;
    left: number
}

export type ImageCropStepProps = 'selecting' | 'end' | 'confirm'

export interface ImageCropProps {
    file: File,
    aspect: number;
    proportions: Proportions,
    sizeConfig: SizeConfig,
    step: ImageCropStepProps
    confirmImage: (file: File) => unknown
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

export interface Proportions {
    [p: string]: (width: number) => boolean
}

export interface SizeConfig {
    [p: string]: {
        maxWidth: number;
        maxHeight: number;
    }
}

export interface OriginalImageSize {
    width: number;
    height: number;
}

export type IncreaseStr = 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';