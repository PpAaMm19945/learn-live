import { BookOpen, GraduationCap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export type LessonMode = 'read-aloud' | 'live-lesson';

interface LessonModeDialogProps {
  open: boolean;
  onSelect: (mode: LessonMode) => void;
}

export function LessonModeDialog({ open, onSelect }: LessonModeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md gap-6 border-border/60 bg-card"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            How should we learn today?
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Choose how your child experiences this lesson
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <button
            onClick={() => onSelect('read-aloud')}
            className="flex items-start gap-4 rounded-xl border border-border/50 bg-background p-5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">Read Aloud</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Parent reads the storybook — you control the pace and narrate
                for your child.
              </p>
            </div>
          </button>

          <button
            onClick={() => onSelect('live-lesson')}
            className="flex items-start gap-4 rounded-xl border border-border/50 bg-background p-5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">Live Lesson</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The AI teacher narrates and teaches — interactive maps,
                timelines, and visuals included.
              </p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
