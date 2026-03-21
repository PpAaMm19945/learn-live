import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScriptPlayer } from '@/components/player/ScriptPlayer';
import { StorybookPlayer } from '@/components/player/StorybookPlayer';
import { useLearnerStore } from '@/lib/learnerStore';
import { LessonScript, StorybookScript } from '@/lib/player/types';
import { LessonDrawerItem } from '@/components/player/LessonDrawer';

// Chapter metadata — will eventually come from an API or config
const CHAPTER_METADATA: Record<string, { title: string; lessons: LessonDrawerItem[] }> = {
  ch01: {
    title: 'Chapter 1: Creation, the Fall & the Table of Nations',
    lessons: [
      { id: '1.1', title: 'In the Beginning — Creation & Fall', status: 'playing' },
      { id: '1.2', title: 'The Table of Nations', status: 'locked' },
      { id: '1.3', title: 'The Hamitic Line', status: 'locked' },
      { id: '1.4', title: 'The Curse of Canaan', status: 'locked' },
      { id: '1.5', title: 'Controversies & Corrections', status: 'locked' },
    ],
  },
};

export default function LessonPlayerPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const activeLearnerBand = useLearnerStore((s) => s.activeLearnerBand);
  const activeLearnerName = useLearnerStore((s) => s.activeLearnerName);

  const [script, setScript] = useState<LessonScript | null>(null);
  const [storybookScript, setStorybookScript] = useState<StorybookScript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isStorybook = activeLearnerBand <= 1;
  const chapterMeta = chapterId ? CHAPTER_METADATA[chapterId] : null;

  useEffect(() => {
    if (!chapterId) return;

    const scriptPath = `/scripts/lesson_${chapterId}_band${activeLearnerBand}.json`;

    setLoading(true);
    setError(null);

    fetch(scriptPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Script not found: ${scriptPath} (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (isStorybook) {
          setStorybookScript(data as StorybookScript);
        } else {
          setScript(data as LessonScript);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load lesson script:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [chapterId, activeLearnerBand, isStorybook]);

  const handleExit = () => {
    navigate('/dashboard');
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-lg font-medium">Loading lesson...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6 max-w-md text-center px-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-white">Lesson Not Available</h2>
          <p className="text-zinc-400">
            {error}
          </p>
          <p className="text-zinc-500 text-sm">
            This lesson script hasn't been generated for Band {activeLearnerBand} yet.
          </p>
          <button
            onClick={handleExit}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Storybook player (Band 0-1)
  if (isStorybook && storybookScript) {
    return (
      <StorybookPlayer
        script={storybookScript}
        onExit={handleExit}
        onComplete={() => {
          console.log('Storybook complete');
          navigate('/dashboard');
        }}
      />
    );
  }

  // Script player (Band 2-5)
  if (script) {
    return (
      <ScriptPlayer
        script={script}
        lessonTitle={chapterMeta?.title || `Chapter ${chapterId}`}
        chapterTitle={chapterMeta?.title || ''}
        band={activeLearnerBand}
        learnerName={activeLearnerName || 'Learner'}
        lessons={chapterMeta?.lessons || []}
        onExit={handleExit}
      />
    );
  }

  return null;
}
