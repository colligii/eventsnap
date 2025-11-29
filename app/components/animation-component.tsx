"use client";

import { motion, useScroll, useTransform } from "motion/react";
import React, { useRef } from "react";

export default function AnimatedDivScroll({ children, className }: AnimatedDivProps) {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 0.4", "1 0"],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.6, 1.6]);

    return (
        <motion.div
            ref={ref}
            style={{ scale }}
            className={`will-change-transform ${className ?? ''}`}
        >
            {children}
        </motion.div>
    );
}

export type AnimatedDivProps = React.PropsWithChildren & {
    className?: string;
};
