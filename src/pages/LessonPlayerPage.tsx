import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SessionCanvas } from '@/components/session/SessionCanvas';
import { StorybookPlayer } from '@/components/player/StorybookPlayer';
import { LiveStorybookPlayer } from '@/components/player/LiveStorybookPlayer';
import { LessonModeDialog, type LessonMode } from '@/components/player/LessonModeDialog';
import { useLearnerStore } from '@/lib/learnerStore';
import {
  lessonIdFromChapterParam,
  markLessonStarted,
  markLessonCompleted,
} from '@/lib/lessonProgress';
import type { StorybookScript } from '@/lib/session/types';

export default function LessonPlayerPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const activeLearnerBand = useLearnerStore((s) => s.activeLearnerBand);
  const activeLearnerName = useLearnerStore((s) => s.activeLearnerName);
  const activeLearnerId = useLearnerStore((s) => s.activeLearnerId);

  const isStorybook = activeLearnerBand <= 1;
  const lessonId = lessonIdFromChapterParam(chapterId);

  // Mode selection for bands 0-1
  const [selectedMode, setSelectedMode] = useState<LessonMode | null>(
    isStorybook ? null : 'live-lesson'
  );

  // Pre-rendered script loading (only needed for read-aloud mode)
  const [storybookScript, setStorybookScript] = useState<StorybookScript | null>(null);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [scriptNotFound, setScriptNotFound] = useState(false);

  // Mark lesson started on mount (once per lesson id)
  useEffect(() => {
    if (lessonId && activeLearnerId) {
      markLessonStarted(lessonId);
    }
  }, [lessonId, activeLearnerId]);

  // Load storybook script when read-aloud is selected
  useEffect(() => {
    if (!chapterId || selectedMode !== 'read-aloud') return;

    setScriptLoading(true);
    const scriptPath = `/scripts/lesson_${chapterId}_band${activeLearnerBand}.json`;
    fetch(scriptPath)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => {
        setStorybookScript(data as StorybookScript);
        setScriptLoading(false);
      })
      .catch(() => {
        setScriptNotFound(true);
        setScriptLoading(false);
      });
  }, [chapterId, activeLearnerBand, selectedMode]);

  const handleExit = () => navigate('/dashboard');

  const handleComplete = () => {
    if (lessonId) {
      // Fire-and-forget; navigation must not wait on a network round-trip.
      markLessonCompleted(lessonId);
    }
    navigate('/dashboard');
  };

  // Ensure learner is selected
  useEffect(() => {
    if (!activeLearnerId) {
      navigate('/dashboard');
    }
  }, [activeLearnerId, navigate]);

  if (!activeLearnerId) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Band 0-1: show mode selection dialog
  if (isStorybook && !selectedMode) {
    return (
      <div className="fixed inset-0 bg-background">
        <LessonModeDialog open onSelect={setSelectedMode} />
      </div>
    );
  }

  // Loading spinner for read-aloud script fetch
  if (scriptLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Read-aloud mode → StorybookPlayer or LiveStorybookPlayer fallback
  if (selectedMode === 'read-aloud' && isStorybook) {
    if (storybookScript && !scriptNotFound) {
      return (
        <StorybookPlayer
          script={storybookScript}
          onExit={handleExit}
          onComplete={handleComplete}
        />
      );
    }
    return (
      <LiveStorybookPlayer
        chapterId={chapterId || 'ch01'}
        band={activeLearnerBand}
        onExit={handleExit}
        onComplete={handleComplete}
      />
    );
  }

  // Live lesson → SessionCanvas (all bands including 0-1)
  return (
    <SessionCanvas
      chapterId={chapterId || 'ch01'}
      band={activeLearnerBand}
      learnerName={activeLearnerName || 'Learner'}
      onExit={handleExit}
      onComplete={handleComplete}
    />
  );
}
