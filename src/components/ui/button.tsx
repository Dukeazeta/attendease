"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "glass";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {

        const variantStyles = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:shadow-none",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            outline: "border border-border bg-transparent hover:bg-white/5 hover:text-foreground",
            glass: "glass hover:bg-white/10 transition-all",
            ghost: "hover:bg-white/5 hover:text-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        };

        const sizeStyles = {
            default: "h-11 px-6 py-2",
            sm: "h-9 rounded-md px-3 text-xs",
            lg: "h-14 rounded-md px-10 text-md font-semibold tracking-tight",
            icon: "h-11 w-11",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.01, translateY: -1 }}
                whileTap={{ scale: 0.99, translateY: 0 }}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                <span className="relative z-10 flex items-center gap-2">
                    {children as React.ReactNode}
                </span>
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button, cn };
