import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export type WorkbenchSceneMode = 'transcript' | 'map' | 'image' | 'timeline';

interface SceneControlsProps {
  sceneMode: WorkbenchSceneMode;
  imageUrl: string;
  caption: string;
  onSceneChange: (mode: WorkbenchSceneMode, args?: Record<string, any>) => void;
  onImageUrlChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
}

const SCENES: WorkbenchSceneMode[] = ['transcript', 'map', 'image', 'timeline'];

export function SceneControls({
  sceneMode,
  imageUrl,
  caption,
  onSceneChange,
  onImageUrlChange,
  onCaptionChange,
}: SceneControlsProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">Scene Controls</h3>
      <div className="flex flex-wrap gap-2">
        {SCENES.map((mode) => (
          <Button
            key={mode}
            variant={sceneMode === mode ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSceneChange(mode, mode === 'image' ? { imageUrl, caption } : undefined)}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        ))}
      </div>
      {sceneMode === 'image' && (
        <div className="grid gap-2">
          <Input
            value={imageUrl}
            onChange={(event) => onImageUrlChange(event.target.value)}
            placeholder="Image URL"
          />
          <Input
            value={caption}
            onChange={(event) => onCaptionChange(event.target.value)}
            placeholder="Caption"
          />
          <Button size="sm" onClick={() => onSceneChange('image', { imageUrl, caption })}>Apply Image Scene</Button>
        </div>
      )}
    </section>
  );
}
