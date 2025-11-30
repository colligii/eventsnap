import { Form } from "../components/event-form/form";


export default function EventForm() {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="flex flex-col items-center ">
                <h1 className="font-black text-2xl">Perguntas para configurar o evento</h1>
                <h1 className="text-gray-700">Precisamos fazer essas perguntas para entender melhor seu evento</h1>
            </div>
            <Form/>
        </div>
    )
}

