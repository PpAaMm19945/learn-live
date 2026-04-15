import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SessionCanvas } from '@/components/session/SessionCanvas';
import { StorybookPlayer } from '@/components/player/StorybookPlayer';
import { LiveStorybookPlayer } from '@/components/player/LiveStorybookPlayer';
import { useLearnerStore } from '@/lib/learnerStore';
import type { StorybookScript } from '@/lib/session/types';

export default function LessonPlayerPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const activeLearnerBand = useLearnerStore((s) => s.activeLearnerBand);
  const activeLearnerName = useLearnerStore((s) => s.activeLearnerName);

  const isStorybook = activeLearnerBand <= 1;

  // Try to load a pre-rendered script for bands 0-1 (offline/cached fallback)
  const [storybookScript, setStorybookScript] = useState<StorybookScript | null>(null);
  const [scriptLoading, setScriptLoading] = useState(isStorybook);
  const [scriptNotFound, setScriptNotFound] = useState(false);

  useEffect(() => {
    if (!chapterId || !isStorybook) return;

    setScriptLoading(true);
    const scriptPath = `/scripts/lesson_${chapterId}_band${activeLearnerBand}.json`;
    fetch(scriptPath)
      .then((res) => {
        if (!res.ok) throw new Error(`not found`);
        return res.json();
      })
      .then((data) => {
        setStorybookScript(data as StorybookScript);
        setScriptLoading(false);
      })
      .catch(() => {
        // No pre-rendered script — will use live WebSocket storybook
        setScriptNotFound(true);
        setScriptLoading(false);
      });
  }, [chapterId, activeLearnerBand, isStorybook]);

  const handleExit = () => navigate('/dashboard');

  const activeLearnerId = useLearnerStore((s) => s.activeLearnerId);

  // Ensure learner is selected
  useEffect(() => {
    if (!scriptLoading && !activeLearnerId) {
      navigate('/dashboard');
    }
  }, [scriptLoading, activeLearnerId, navigate]);

  if (scriptLoading || !activeLearnerId) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Band 0-1: Use pre-rendered script if available, otherwise live storybook
  if (isStorybook) {
    if (storybookScript && !scriptNotFound) {
      return (
        <StorybookPlayer
          script={storybookScript}
          onExit={handleExit}
          onComplete={() => navigate('/dashboard')}
        />
      );
    }

    // Live WebSocket storybook
    return (
      <LiveStorybookPlayer
        chapterId={chapterId || 'ch01'}
        band={activeLearnerBand}
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
