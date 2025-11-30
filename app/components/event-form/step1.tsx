import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { FormEvent } from "react"
import { motion } from 'motion/react'
import { UpdateFormFn } from "@/app/hooks/step-form"

export const Step1 = ({ updateForm, submit }: Step1Props) => {

    const handleKeyChanges = (event: FormEvent<HTMLInputElement>) => {
        const input = event.target as HTMLInputElement;
        updateForm({ name: input.value ?? '' })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3 items-center"
        >
            <h3 className="font-semibold">Como podemos nomear o seu evento?</h3>
            <div className="flex gap-2">
                <Input required={true} onInput={handleKeyChanges} type="text" placeholder="Nome do evento" />
                <Button onClick={submit} type="submit" variant="outline">
                    Continuar
                </Button>
            </div>
        </motion.div>
    )
}

export interface Step1Props {
    updateForm: UpdateFormFn,
    submit: () => any
}