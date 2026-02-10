"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "tonal" | "outlined" | "ghost" | "link" | "glass";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {

        const variantStyles = {
            primary: "bg-primary text-primary-foreground hover:bg-[#2F3034] active:bg-[#45474D] shadow-sm",
            secondary: "bg-secondary text-secondary-foreground hover:bg-[#E6EAF0] active:bg-[#CDD4DC]",
            tonal: "bg-surface-container text-foreground hover:bg-[#E6EAF0]",
            outlined: "border border-border bg-transparent hover:bg-surface-container text-foreground",
            glass: "glass hover:bg-white/95 text-foreground",
            ghost: "hover:bg-[rgba(33,34,38,0.04)] text-foreground",
            link: "text-accent underline-offset-4 hover:underline",
        };

        const sizeStyles = {
            default: "h-11 px-6 py-2",
            sm: "h-9 px-4 text-[13px]",
            lg: "h-14 px-10 text-[15px] font-[450]",
            icon: "h-11 w-11",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-full)] text-[14.5px] font-[450] tracking-[0.11px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
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
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, cn };
