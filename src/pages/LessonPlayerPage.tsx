import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SessionCanvas } from '@/components/session/SessionCanvas';
import { StorybookPlayer } from '@/components/player/StorybookPlayer';
import { useLearnerStore } from '@/lib/learnerStore';
import type { StorybookScript } from '@/lib/session/types';

export default function LessonPlayerPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const activeLearnerBand = useLearnerStore((s) => s.activeLearnerBand);
  const activeLearnerName = useLearnerStore((s) => s.activeLearnerName);

  const isStorybook = activeLearnerBand <= 1;

  const [storybookScript, setStorybookScript] = useState<StorybookScript | null>(null);
  const [loading, setLoading] = useState(isStorybook);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chapterId || !isStorybook) return;

    setLoading(true);
    const scriptPath = `/scripts/lesson_${chapterId}_band${activeLearnerBand}.json`;
    fetch(scriptPath)
      .then((res) => {
        if (!res.ok) throw new Error(`Script not found: ${scriptPath} (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setStorybookScript(data as StorybookScript);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [chapterId, activeLearnerBand, isStorybook]);

  const handleExit = () => navigate('/dashboard');

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 max-w-md text-center px-6">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-xl font-bold text-foreground">Lesson Not Available</h2>
          <p className="text-muted-foreground text-sm">{error}</p>
          <button onClick={handleExit} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isStorybook && storybookScript) {
    return (
      <StorybookPlayer
        script={storybookScript}
        onExit={handleExit}
        onComplete={() => navigate('/dashboard')}
      />
    );
  }

  // Band 2+ → Live SessionCanvas
  return (
    <SessionCanvas
      chapterId={chapterId || 'ch01'}
      band={activeLearnerBand}
      learnerName={activeLearnerName || 'Learner'}
      onExit={handleExit}
    />
  );
}
