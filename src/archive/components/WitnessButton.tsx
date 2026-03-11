import React from 'react';
import { Eye } from 'lucide-react';
import { Logger } from '@/lib/Logger';

interface WitnessButtonProps {
    onClick: () => void;
}

export function WitnessButton({ onClick }: WitnessButtonProps) {
    const handleClick = () => {
        Logger.info('[UI]', 'Witness button tapped — requesting permissions');
        onClick();
    };

    return (
        <button
            onClick={handleClick}
            className="group relative inline-flex items-center justify-center gap-4 px-12 py-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-2xl md:text-4xl rounded-full shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.6)] transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
            <Eye className="w-10 h-10 md:w-14 md:h-14 animate-pulse" />
            <span>Summon Witness</span>
            <div className="absolute inset-0 rounded-full border-4 border-primary opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
        </button>
    );
}
