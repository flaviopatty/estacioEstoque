import React from 'react';
import { cn } from '../../utils/cn';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    icon?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    icon,
    maxWidth = 'md'
}) => {
    if (!isOpen) return null;

    const maxWidths = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={cn(
                    "bg-surface-dark border border-border-dark w-full rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300",
                    maxWidths[maxWidth]
                )}
            >
                <div className="bg-primary p-6 flex justify-between items-center">
                    <h2 className="text-white text-xl font-bold flex items-center gap-2">
                        {icon && <span className="material-symbols-outlined">{icon}</span>}
                        {title}
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
