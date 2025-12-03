import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { FormEvent, useRef, useState } from "react"
import { motion } from 'motion/react'
import { UpdateFormFn } from "@/app/hooks/step-form"
import { Label } from "@/components/ui/label"
import { ImageCrop } from "../image-crop"

export const Step3 = ({ updateForm, sectionNumber }: Step1Props) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: FormEvent<HTMLInputElement>) => {
        const inputFile = event.target as HTMLInputElement;

        if (file || inputFile.files?.length !== 1)
            return;

        setFile(inputFile.files[0]);
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
                width={250}
                aspect={9 / 16}
            ></ImageCrop>
        </motion.div>
    )
}

export interface Step1Props {
    updateForm: UpdateFormFn,
    sectionNumber: number;
}