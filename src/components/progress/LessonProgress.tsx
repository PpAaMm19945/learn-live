import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IconCircleCheck, IconCircle, IconClock } from '@tabler/icons-react';

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

interface LessonProgressProps {
    status: LessonStatus;
    className?: string;
}

export const LessonProgress: React.FC<LessonProgressProps> = ({ status, className = '' }) => {
    switch (status) {
        case 'completed':
            return (
                <Badge variant="default" className={`bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-1 ${className}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                </Badge>
            );
        case 'in_progress':
            return (
                <Badge variant="secondary" className={`bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center space-x-1 ${className}`}>
                    <Clock className="w-3 h-3" />
                    <span>In Progress</span>
                </Badge>
            );
        case 'not_started':
        default:
            return (
                <Badge variant="outline" className={`text-muted-foreground border-muted-foreground/30 flex items-center space-x-1 ${className}`}>
                    <Circle className="w-3 h-3" />
                    <span>Not Started</span>
                </Badge>
            );
    }
};
