import { Section } from "./section"
import Image from 'next/image'
import image from '@/public/image.jpg'
import AnimatedDivScroll from "../animation-component"

export const Main = () => {
    return (
        <>
            <div id="home" className="w-full overflow-hidden">
                <AnimatedDivScroll>
                    <Section className="flex w-full">
                        <div className="py-24 flex flex-col gap-8 flex-1 items-start">
                            <h1 className="text-4xl font-bold w-100 leading-10">Memorize seus melhores momentos.</h1>
                            <span className="w-80">Crie uma galeria moderna, rápida e organizada automaticamente.</span>
                            <button className="bg-blue-400 bg-gradient-to-r from-yellow-400 to-emerald-400 rounded-full py-2.5 px-6">
                                Registrar momento
                            </button>
                        </div>
                        <div className="flex relative flex-col flex-1 gap-8 items-end justify-center h-full">
                            <div className="flex relative right-2 items-center justify-center h-[450px] bg-gray-100">
                                <div className="relative w-[300px] h-[450px] bg-orange-300 rounded-md shadow-lg transform skew-x-12 overflow-hidden">

                                    <div className="absolute inset-0 transform -skew-x-12">
                                        <Image
                                            src={image.src}
                                            fill
                                            className="object-cover"
                                            alt="Pessoas curtindo uma festa"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                    </Section>
                </AnimatedDivScroll>
            </div>
            <Section id="home" className="flex h-240 w-full">
            </Section>
        </>
    )
}