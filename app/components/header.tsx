"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import logo from '@/public/logo.png'

export const Header = () => {
    const [isTop, setIsTop] = useState(true);

    const handleScroll = () => {
        setIsTop(window.scrollY === 0);
    }

    useEffect(() => {
        setIsTop(window.scrollY === 0);

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const headerClasses = isTop ? 
        'bg-white top-1' :
        'bg-white top-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] scale-[0.99]';

    return (
        <header className={`fixed rounded-md px-13 top-3 flex h-14 justify-between items-center w-full transition-all max-w-280 z-10 lg:left-1/2 lg:-translate-x-1/2 ${headerClasses}`}>
            <Image src={logo} alt="Logo" height={40}/>
            <nav className="flex gap-8">
                <a href="#home">Home</a>
                <a href="/">Home</a>
                <a href="/">Home</a>
                <a href="/">Home</a>
            </nav>
            <div className="flex gap-4">
                <button>Logar</button>
                <button>Registrar</button>
            </div>
        </header>
    )
}