import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScriptPlayer } from '@/components/player/ScriptPlayer';
import { StorybookPlayer } from '@/components/player/StorybookPlayer';
import { useLearnerStore } from '@/lib/learnerStore';
import { LessonScript, StorybookScript } from '@/lib/player/types';
import { LessonDrawerItem } from '@/components/player/LessonDrawer';
import { loadLessonScript } from '@/data/lessons';
import { getChapterGeoJSON } from '@/data/geojson';

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
  ch02: { title: 'Chapter 2: Egypt — Land of the Pharaohs', lessons: [] },
  ch03: { title: 'Chapter 3: Cush & Nubia', lessons: [] },
  ch04: { title: 'Chapter 4: Carthage & North Africa', lessons: [] },
  ch05: { title: 'Chapter 5: The Church in Africa', lessons: [] },
  ch06: { title: 'Chapter 6: Islam & the Trans-Saharan World', lessons: [] },
  ch07: { title: 'Chapter 7: West African Kingdoms', lessons: [] },
  ch08: { title: 'Chapter 8: East & Southern Africa', lessons: [] },
  ch09: { title: 'Chapter 9: The Modern Era', lessons: [] },
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

  // Load GeoJSON for the chapter
  const chapterGeoJSON = useMemo(() => {
    if (!chapterId) return undefined;
    const num = parseInt(chapterId.replace('ch', ''), 10);
    const data = getChapterGeoJSON(num);
    return data?.regions as GeoJSON.FeatureCollection | undefined;
  }, [chapterId]);

  useEffect(() => {
    if (!chapterId) return;

    setLoading(true);
    setError(null);

    if (isStorybook) {
      // Storybook scripts still use the old fetch path
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
          console.error('Failed to load storybook script:', err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      // Use the new lesson loader with adapter
      const fetchScriptWithRetry = async (attempt = 1): Promise<void> => {
        try {
          const adapted = await loadLessonScript(chapterId, activeLearnerBand);
          setScript(adapted);
          setLoading(false);
        } catch (err: any) {
          if (attempt < 3) {
            console.log(`Retry attempt ${attempt + 1} for lesson script...`);
            setTimeout(() => fetchScriptWithRetry(attempt + 1), 1000);
          } else {
            console.error('Failed to load lesson script after retries:', err);
            setError(err.message);
            setLoading(false);
          }
        }
      };

      fetchScriptWithRetry();
    }
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
          <p className="text-muted-foreground text-lg font-medium">Loading lesson...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6 max-w-md text-center px-6">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">Lesson Not Available</h2>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-muted-foreground/70 text-sm">
            This lesson script hasn't been generated for Band {activeLearnerBand} yet.
          </p>
          <button
            onClick={handleExit}
            className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
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
        chapterGeoJSON={chapterGeoJSON}
        onExit={handleExit}
      />
    );
  }

  return null;
}
