"use client";

import * as React from "react";
import { cn } from "./button";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === "password";
        const resolvedType = isPassword && showPassword ? "text" : type;

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-[13px] font-[450] text-muted-foreground tracking-[0.1px] ml-0.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={resolvedType}
                        className={cn(
                            "flex h-12 w-full rounded-[var(--radius-full)] border border-border bg-background px-5 py-2 text-[15px] text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent/50 disabled:cursor-not-allowed disabled:opacity-40 transition-all duration-200",
                            isPassword && "pr-12",
                            error && "border-destructive ring-destructive/40 focus-visible:ring-destructive/40",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-[18px] h-[18px]" />
                            ) : (
                                <Eye className="w-[18px] h-[18px]" />
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-[12.5px] font-[450] text-destructive px-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
