"use client"
import React, { useEffect, useRef, useState } from "react"
import { Step1 } from "./step1"
import useStepForm from "@/app/hooks/step-form"
import { Button } from "@/components/ui/button"
import { motion } from 'motion/react';
import { Step2 } from "./step2"

export const Form = () => {
    const [form, step, _, updateForm, submit, lastStep] = useStepForm<Form>((step, form, handleNextStep) => {
        if (step === 1) {
            if (!form.name)
                return;

            handleNextStep()
        }
    })
    let element;

    if (step === 1) {
        element = <Step1 updateForm={updateForm} defaultName={form.name ?? ''}></Step1>;
    } else if (step === 2) {
        element = <Step2 updateForm={updateForm} defaultSections={form.sections ?? 1}></Step2>;
    }

    return (
        <div className="h-76">
            <div className="h-72 gap-4 flex flex-col items-center justify-center">
                {element}
            </div>

            <div className="flex justify-between">

                <motion.div
                    initial={{ opacity: 0.4 }}
                    animate={step > 1 && { opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button onClick={lastStep}>Anterior</Button>
                </motion.div>
                <Button onClick={submit} type="submit" variant="outline">
                    Continuar
                </Button>
            </div>
        </div>
    )
}

export interface Form {
    name?: string;
    sections?: number;
}
