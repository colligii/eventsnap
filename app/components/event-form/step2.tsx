import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { FormEvent } from "react"
import { motion } from 'motion/react'
import { UpdateFormFn } from "@/app/hooks/step-form"

export const Step2 = ({ updateForm, defaultSections }: Step1Props) => {

    const handleKeyChanges = (event: FormEvent<HTMLInputElement>) => {
        const input = event.target as HTMLInputElement;
        const sections = Number(input.value);
        if (!input.value?.length && isNaN(sections))
            return;

        updateForm({ sections })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3 items-center"
        >
            <h3 className="font-semibold">Quantas sessões você gostaria de ter?</h3>
            <Input defaultValue={defaultSections} required={true} onInput={handleKeyChanges} type="number" placeholder="Ex: 12" className="w-full" />

        </motion.div>
    )
}

export interface Step1Props {
    updateForm: UpdateFormFn,
    defaultSections: number;
}