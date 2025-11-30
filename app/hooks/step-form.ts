import { useEffect, useRef, useState } from "react";

export default function useStepForm<T>(
    submit: (step: number, form: T, handleNextStep: HandleNextStepFn) => void
): [T, number, VoidFn, UpdateFormFn, VoidFn, VoidFn] {
    const form = useRef<T>({} as T);

    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        setStep(step => step + 1);
    }

    const lastStep = () => {
        if(step <= 1)
            return;

        setStep(step => step - 1);
    }

    const handleSubmit = () => {
        submit(step, form.current, handleNextStep);
    }

    const submitKeyBoard = (e: { key: string }) => {
        if (e.key === 'Enter')
            handleSubmit();
    }

    const updateForm: UpdateFormFn = (newForm: Partial<T>) => {
        form.current = { ...form.current, ...newForm }
    }

    useEffect(() => {
        document.addEventListener('keypress', submitKeyBoard);
        return () => document.removeEventListener('keypress', submitKeyBoard)
    }, [])

    return [form.current as T, step, handleNextStep, updateForm, handleSubmit, lastStep]
}


export type UpdateFormFn = (form: Partial<any>) => void;
export type VoidFn = () => void
export type HandleNextStepFn = () => void;