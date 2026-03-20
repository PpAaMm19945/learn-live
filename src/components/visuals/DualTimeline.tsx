import React from 'react';
import { motion } from 'framer-motion';

export interface TimelineEvent {
  id: string;
  dateStr: string;
  title: string;
  description?: string;
  type: 'biblical' | 'historiography';
}

export interface DualTimelineProps {
  events: TimelineEvent[];
  mode: 'biblical' | 'dual' | 'historiography';
  activeEventId?: string;
  band: number;
}

export const DualTimeline: React.FC<DualTimelineProps> = ({
  events = [],
  mode,
  activeEventId,
  band,
}) => {
  if (band < 2 || events.length === 0) return null;

  const showDual = band >= 3 && mode === 'dual';
  const filteredEvents = showDual
    ? events
    : events.filter((e) => e.type === (mode === 'historiography' ? 'historiography' : 'biblical'));

  const biblicalEvents = filteredEvents.filter((e) => e.type === 'biblical');
  const historyEvents = filteredEvents.filter((e) => e.type === 'historiography');

  return (
    <motion.div
      className="w-full overflow-x-auto bg-black/70 backdrop-blur-md rounded-xl border border-border/50 p-6 shadow-2xl flex flex-col gap-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative min-w-max flex flex-col gap-12">
        {/* Biblical Timeline Row */}
        {(mode === 'biblical' || showDual) && (
          <div className="relative flex items-center gap-8 min-h-[120px]">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-amber-500/50 -translate-y-1/2" />
            {biblicalEvents.map((evt) => (
              <TimelineNode
                key={evt.id}
                event={evt}
                isActive={evt.id === activeEventId}
                colorClass="bg-amber-500"
                borderColor="border-amber-400"
              />
            ))}
          </div>
        )}

        {/* Historiography Timeline Row */}
        {(mode === 'historiography' || showDual) && (
          <div className="relative flex items-center gap-8 min-h-[120px]">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-500/50 -translate-y-1/2" />
            {historyEvents.map((evt) => (
              <TimelineNode
                key={evt.id}
                event={evt}
                isActive={evt.id === activeEventId}
                colorClass="bg-blue-500"
                borderColor="border-blue-400"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TimelineNode: React.FC<{
  event: TimelineEvent;
  isActive: boolean;
  colorClass: string;
  borderColor: string;
}> = ({ event, isActive, colorClass, borderColor }) => {
  return (
    <div
      className={`relative flex flex-col items-center min-w-[200px] z-10 ${
        isActive ? 'opacity-100 scale-110' : 'opacity-80 scale-100'
      } transition-all duration-300`}
    >
      <div className={`w-4 h-4 rounded-full ${colorClass} shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20`} />
      <div
        className={`mt-4 bg-card text-card-foreground border ${
          isActive ? `border-2 ${borderColor}` : 'border-border'
        } p-4 rounded-lg shadow-lg w-full text-center`}
      >
        <div className={`text-sm font-bold mb-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          {event.dateStr}
        </div>
        <div className="font-semibold text-lg leading-tight mb-2">{event.title}</div>
        {isActive && event.description && (
          <div className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </div>
        )}
      </div>
    </div>
  );
};
