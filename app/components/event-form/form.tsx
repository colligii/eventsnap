"use client"
import React, { useEffect, useRef, useState } from "react"
import { Step1 } from "./step1"
import useStepForm from "@/app/hooks/step-form"

export const Form = () => {
    const [_, step, _a, updateForm, submit] = useStepForm<Form>((step, form, handleNextStep) => {
        if(step === 1) {
            if(!form.name)
                return;

            handleNextStep()
        }
    })
    let element;

    if(step === 1) {
        element = <Step1 updateForm={updateForm} submit={submit}></Step1>;
    }

    return (
        <div className="h-72 gap-4 flex flex-col items-center justify-center">
            {element}
        </div>
    )
}

export interface Form {
    name?: string;
}
