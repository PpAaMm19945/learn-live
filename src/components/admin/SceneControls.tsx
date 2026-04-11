import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

const IMAGE_PRESETS: { label: string; url: string; caption: string }[] = [
  { label: 'Nile Valley (R2)', url: '/storybook/ch01/nile_valley.webp', caption: 'The fertile Nile Valley' },
  { label: 'Tower of Babel (R2)', url: '/storybook/ch01/tower_of_babel.webp', caption: 'The Tower of Babel' },
  { label: 'Migration Routes (R2)', url: '/storybook/ch01/migration_routes.webp', caption: 'Ancient migration paths' },
  { label: 'African Kingdoms (R2)', url: '/storybook/ch01/african_kingdoms.webp', caption: 'Early African kingdoms' },
  { label: 'External test (Unsplash)', url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', caption: 'External image test' },
];

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
          <Label className="text-xs text-muted-foreground">Image Presets</Label>
          <Select onValueChange={(idx) => {
            const preset = IMAGE_PRESETS[Number(idx)];
            if (preset) {
              onImageUrlChange(preset.url);
              onCaptionChange(preset.caption);
            }
          }}>
            <SelectTrigger><SelectValue placeholder="Select a test image…" /></SelectTrigger>
            <SelectContent>
              {IMAGE_PRESETS.map((preset, i) => (
                <SelectItem key={i} value={String(i)}>{preset.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={imageUrl}
            onChange={(event) => onImageUrlChange(event.target.value)}
            placeholder="Image URL (or paste custom)"
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
