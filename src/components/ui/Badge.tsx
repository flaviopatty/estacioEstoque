import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const Badge: React.FC<BadgeProps> = ({
    className,
    variant = 'neutral',
    children,
    ...props
}) => {
    const variants = {
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        error: 'bg-red-500/10 text-red-500 border-red-500/20',
        info: 'bg-primary/10 text-primary border-primary/20',
        neutral: 'bg-white/5 text-[#9e9eb7] border-white/10',
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Badge;
