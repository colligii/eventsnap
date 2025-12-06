import { RefObject } from "react";

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
    confirmImage: ConfirmImageFunction
}

export type ConfirmImageFunction = (file: File) => unknown

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

export interface UseCanvaConfig {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    step: ImageCropStepProps;
    originalImageSize: RefObject<OriginalImageSize | null>;
    renderSize: RenderImageSize | null,
    cropConfig: CropConfig;
    aspect: number;
    proportions: Proportions;
    sizeConfig: SizeConfig;
    imageUrl: string;
    confirmImage: ConfirmImageFunction
}

export type IncreaseStr = 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';