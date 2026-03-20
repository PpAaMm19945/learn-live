import React, { useRef, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Check, Lock, Play } from 'lucide-react';

export interface LessonDrawerItem {
  id: string;
  title: string;
  status: 'complete' | 'playing' | 'locked' | 'available';
}

interface LessonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chapterTitle: string;
  lessons: LessonDrawerItem[];
  onSelectLesson: (id: string) => void;
}

export function LessonDrawer({
  isOpen,
  onClose,
  chapterTitle,
  lessons,
  onSelectLesson,
}: LessonDrawerProps) {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Drawer */}
      <motion.div
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          if (info.offset.y > 100) onClose();
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-zinc-900 rounded-t-2xl z-50 flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Drag Handle */}
        <div
          className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing hover:bg-white/5"
          onPointerDown={(e) => controls.start(e)}
        >
          <div className="w-12 h-1.5 bg-zinc-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white truncate pr-4">
            {chapterTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Lesson List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              onClick={() => {
                if (lesson.status !== 'locked' && !isDragging) {
                  onSelectLesson(lesson.id);
                }
              }}
              className={`flex items-center space-x-4 p-4 rounded-xl mb-2 transition-all ${
                lesson.status === 'playing'
                  ? 'bg-primary/20 border border-primary/50'
                  : lesson.status === 'locked'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white/5 cursor-pointer'
              }`}
            >
              <div className="flex-shrink-0 w-8 flex justify-center">
                {lesson.status === 'complete' && <Check className="w-5 h-5 text-green-400" />}
                {lesson.status === 'playing' && <Play className="w-5 h-5 text-primary fill-primary" />}
                {lesson.status === 'locked' && <Lock className="w-5 h-5 text-zinc-500" />}
                {lesson.status === 'available' && <span className="text-zinc-400 text-sm font-medium">{index + 1}</span>}
              </div>

              <div className="flex-1">
                <h3 className={`font-medium ${lesson.status === 'playing' ? 'text-primary' : 'text-zinc-200'}`}>
                  {lesson.title}
                </h3>
              </div>

              <div className="flex-shrink-0">
                <span className="text-xs uppercase font-semibold text-zinc-500">
                  {lesson.status === 'playing' ? 'Playing' : lesson.status === 'complete' ? 'Done' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
