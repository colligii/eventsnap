import { useMemo, useRef, useState } from "react";
import { CropConfig, ImageCropProps, OriginalImageSize, RenderImageSize } from "./types";
import Cropper from "./cropper";
import { Canvas } from "./canvas";

export const ImageCrop = ({ file, aspect, proportions, sizeConfig, step, confirmImage }: ImageCropProps) => {
    
    const [renderSize, setRenderSize] = useState<RenderImageSize | null>(null);
    const originalImageSize = useRef<OriginalImageSize>(null);
    const [cropConfig, setCropConfig] = useState<CropConfig>({ ratio: 0.2, startX: 0, startY: 0 })
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageUrl = useMemo(() => {
        return URL.createObjectURL(file)
    }, [file]);


    if(step === 'selecting') {
        return <Cropper 
            imageUrl={imageUrl}
            aspect={aspect}
            confirmImage={confirmImage}
            cropConfig={cropConfig}
            proportions={proportions}
            setCropConfig={setCropConfig}
            sizeConfig={sizeConfig}
            originalImageSize={originalImageSize}
            renderSize={renderSize}
            setRenderSize={setRenderSize}
            step={step}
        ></Cropper>
    }

    console.log(step, imageUrl)

    if ((step === 'end' || step === 'confirm') && imageUrl) {
        return <Canvas
            aspect={aspect}
            canvasRef={canvasRef}
            confirmImage={confirmImage}
            cropConfig={cropConfig}
            imageUrl={imageUrl}
            originalImageSize={originalImageSize}
            proportions={proportions}
            renderSize={renderSize}
            sizeConfig={sizeConfig}
            step={step}
        ></Canvas>        
    }

    return <h1>Some error hapened :(</h1>
}