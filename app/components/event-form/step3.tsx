import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { FormEvent, useRef, useState } from "react"
import { motion } from 'motion/react'
import { UpdateFormFn } from "@/app/hooks/step-form"
import { Label } from "@/components/ui/label"
import { ImageCropStepProps } from "../image-crop/types"
import { ImageCrop } from "../image-crop"

export const Step3 = ({ updateForm, sectionNumber, originalFile, step }: Step3Props) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: FormEvent<HTMLInputElement>) => {
        const inputFile = event.target as HTMLInputElement;

        if (file || inputFile.files?.length !== 1)
            return;

        originalFile.current = inputFile.files[0];

        setFile(inputFile.files[0]);
    }

    const handleConfirmImage = (file: File) => {
        console.log(URL.createObjectURL(file))
    }

    if (!file) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-3 items-center"
            >
                <Label htmlFor="picture">Imagem da seção {sectionNumber}</Label>
                <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onInput={handleFileChange}
                ></Input>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3 items-center"
        >
            <Label>Imagem da seção {sectionNumber}</Label>
            <ImageCrop
                file={file}
                step={step}
                confirmImage={handleConfirmImage}
                aspect={9 / 16}
                proportions={{
                    sm: size => size < 400,
                    md: size => size >= 500 && size < 800,
                    xmd: size => size >= 800 && size < 1000,
                    lg: size => size >= 1000
                }}
                sizeConfig={{
                    sm: { maxWidth: 380, maxHeight: 380 },
                    md: { maxWidth: 480, maxHeight: 380 },
                    xmd: { maxWidth: 780, maxHeight: 380 },
                    lg: { maxWidth: 980, maxHeight: 380 }
                }}
            ></ImageCrop>
        </motion.div>
    )
}

export interface Step3Props {
    updateForm: UpdateFormFn,
    sectionNumber: number;
    step: ImageCropStepProps,
    originalFile: React.RefObject<File | null>
}