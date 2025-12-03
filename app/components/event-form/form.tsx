"use client"
import React, { useEffect, useRef, useState } from "react"
import { Step1 } from "./step1"
import useStepForm from "@/app/hooks/step-form"
import { Button } from "@/components/ui/button"
import { motion } from 'motion/react';
import { Step2 } from "./step2"
import { Step3 } from "./step3"

export const Form = () => {
    const [form, step, _, updateForm, submit, lastStep] = useStepForm<Form>((step, form, handleNextStep) => {
        if (step === 1 && !form.name) 
            return;

        if(step === 2 && (!form.sections || isNaN(form.sections)))
            return;

        if (step > 2 && step <= 2 + (form.sections ?? 1) && !form.files[step - 3])
            return;

        handleNextStep();
    }, { sections: 1 })
    let element;

    if (step === 1) {
        element = <Step1 updateForm={updateForm} defaultName={form.name ?? ''}></Step1>;
    } else if (step === 2) {
        element = <Step2 updateForm={updateForm} defaultSections={form.sections ?? 1}></Step2>;
    } else if (step > 2 && step <= 2 + (form.sections ?? 1)) {
        element = <Step3 updateForm={updateForm} sectionNumber={step - 2}></Step3>
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
    files: FormImage[]
}

export interface FormImage {
    blobImage: Blob,
    startX: number;
    endX: number;
    startY: number;
    endY: number;
}
