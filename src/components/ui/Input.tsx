import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-xs font-bold text-[#9e9eb7] uppercase tracking-widest block">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9e9eb7]">
                            {icon}
                        </span>
                    )}
                    <input
                        className={cn(
                            "w-full bg-[#1c1c2e] border border-border-dark rounded-2xl py-4 text-white placeholder:text-[#9e9eb7] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-inner",
                            icon ? "pl-12 pr-4" : "px-4",
                            error && "border-red-500 focus:ring-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
