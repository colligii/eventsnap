import React from "react"

export const Section = ({ children, className, id }: SectionProps) => {
    return (
        <div id={id} className={`relative px-13 top-16 w-full h-120 max-w-280 lg:left-1/2 lg:-translate-x-1/2 ${className ?? ''}`}>
            {children}
        </div>
    )
}

export type SectionProps= React.PropsWithChildren & {
    className?: string;
    id?: string;
}