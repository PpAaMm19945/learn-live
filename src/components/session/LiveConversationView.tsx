import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

interface LiveConversationViewProps {
  slice: 'gatekeeper' | 'negotiator';
  isAgentSpeaking: boolean;
  isListening: boolean;
  transcriptStream?: string;
}

export function LiveConversationView({
  slice,
  isAgentSpeaking,
  isListening,
  transcriptStream,
}: LiveConversationViewProps) {
  const title = slice === 'gatekeeper' ? 'Getting Ready' : 'Reflecting Together';
  const statusLabel = isAgentSpeaking ? 'Your teacher is talking…' : isListening ? 'Listening…' : 'Preparing…';

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center px-6">
      <div className="absolute top-6 left-6 text-xs uppercase tracking-[0.2em] text-foreground/70 font-semibold">{title}</div>

      <motion.div
        animate={{ scale: isAgentSpeaking ? [1, 1.07, 1] : [1, 1.03, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-40 h-40 rounded-full bg-primary/20 border border-primary/40 shadow-xl flex items-center justify-center"
      >
        <div className="w-24 h-24 rounded-full bg-primary/35" />
      </motion.div>

      <div className="mt-6 text-sm text-foreground/80 font-medium">{statusLabel}</div>
      {transcriptStream && (
        <p className="mt-4 max-w-xl text-center text-sm text-foreground/65 line-clamp-3">{transcriptStream}</p>
      )}

      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 text-xs text-foreground/70">
        <Mic className="w-3.5 h-3.5" />
        <span>Mic active</span>
      </div>
    </div>
  );
}
