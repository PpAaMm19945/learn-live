import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useIsAdmin } from '@/lib/auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconArrowLeft, IconLoader2, IconPlayerPlay, IconCheck, IconX, IconVolume, IconMap2 } from '@tabler/icons-react';

const API_URL = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';

// Chapters available for script loading
const CHAPTERS = [
  { id: 'ch01', label: 'Chapter 1 — Creation, Fall & Table of Nations' },
];

const BANDS = [
  { value: '3', label: 'Band 3 — Ages 10–12' },
  { value: '4', label: 'Band 4 — Ages 13–17' },
  { value: '5', label: 'Band 5 — Ages 18+' },
];

interface SpeakCue {
  id: string;
  timestampMs: number;
  durationMs: number;
  action: string;
  params: { text: string; audioFileId: string };
}

interface LessonScript {
  cues: Array<{
    id: string;
    timestampMs: number;
    durationMs: number;
    action: string;
    params: Record<string, any>;
  }>;
}

// ─────────────────────────────────────────────────
// Audio Generator Tab
// ─────────────────────────────────────────────────

function AudioGeneratorTab() {
  const [chapter, setChapter] = useState('ch01');
  const [band, setBand] = useState('3');
  const [voiceName, setVoiceName] = useState('en-US-Studio-O');
  const [speakingRate, setSpeakingRate] = useState(0.95);
  const [speakCues, setSpeakCues] = useState<SpeakCue[]>([]);
  const [audioStatuses, setAudioStatuses] = useState<Record<string, boolean>>({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [batchGenerating, setBatchGenerating] = useState(false);

  // Load the lesson script from public folder
  useEffect(() => {
    const scriptPath = `/scripts/lesson_${chapter}_band${band}.json`;
    fetch(scriptPath)
      .then(res => {
        if (!res.ok) throw new Error(`Script not found: ${scriptPath}`);
        return res.json();
      })
      .then((data: LessonScript) => {
        const speaks = data.cues
          .filter(c => c.action === 'speak')
          .map(c => ({
            id: c.id,
            timestampMs: c.timestampMs,
            durationMs: c.durationMs,
            action: c.action,
            params: c.params as { text: string; audioFileId: string },
          }));
        setSpeakCues(speaks);
        // Check which audio files exist
        speaks.forEach(cue => {
          fetch(`${API_URL}/api/admin/tts/status/${cue.params.audioFileId}`, { credentials: 'include' })
            .then(r => r.json())
            .then(s => {
              setAudioStatuses(prev => ({ ...prev, [cue.params.audioFileId]: s.exists }));
            })
            .catch(() => {});
        });
      })
      .catch(() => setSpeakCues([]));
  }, [chapter, band]);

  // Load TTS voices
  const { data: voicesData } = useQuery({
    queryKey: ['tts-voices'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/tts/voices`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const generateSingle = async (cue: SpeakCue) => {
    setGeneratingId(cue.id);
    try {
      const res = await fetch(`${API_URL}/api/admin/tts/generate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cue.params.text,
          audioFileId: cue.params.audioFileId,
          voiceName,
          speakingRate,
        }),
      });
      if (res.ok) {
        setAudioStatuses(prev => ({ ...prev, [cue.params.audioFileId]: true }));
      }
    } catch (e) {
      console.error('TTS generation failed:', e);
    }
    setGeneratingId(null);
  };

  const generateAll = async () => {
    setBatchGenerating(true);
    const missing = speakCues.filter(c => !audioStatuses[c.params.audioFileId]);
    try {
      const res = await fetch(`${API_URL}/api/admin/tts/batch`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cues: missing.map(c => ({ text: c.params.text, audioFileId: c.params.audioFileId })),
          voiceName,
          speakingRate,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        const newStatuses = { ...audioStatuses };
        result.results.forEach((r: any) => {
          if (r.success) newStatuses[r.audioFileId] = true;
        });
        setAudioStatuses(newStatuses);
      }
    } catch (e) {
      console.error('Batch TTS failed:', e);
    }
    setBatchGenerating(false);
  };

  const totalCues = speakCues.length;
  const generatedCount = Object.values(audioStatuses).filter(Boolean).length;
  const missingCount = totalCues - generatedCount;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Chapter</label>
          <Select value={chapter} onValueChange={setChapter}>
            <SelectTrigger className="w-[300px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CHAPTERS.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Band</label>
          <Select value={band} onValueChange={setBand}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {BANDS.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Voice</label>
          <Select value={voiceName} onValueChange={setVoiceName}>
            <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(voicesData?.voices || []).map((v: any) => (
                <SelectItem key={v.name} value={v.name}>
                  {v.name.replace('en-US-', '')} ({v.gender})
                </SelectItem>
              ))}
              {!voicesData?.voices?.length && (
                <SelectItem value="en-US-Studio-O">Studio-O (default)</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Rate: {speakingRate.toFixed(2)}×
          </label>
          <input
            type="range"
            min="0.75"
            max="1.25"
            step="0.05"
            value={speakingRate}
            onChange={e => setSpeakingRate(parseFloat(e.target.value))}
            className="w-32 h-8"
          />
        </div>
      </div>

      {/* Stats + Batch button */}
      <div className="flex items-center justify-between bg-card border rounded-lg p-4">
        <div className="flex items-center gap-6 text-sm">
          <span>Total cues: <strong>{totalCues}</strong></span>
          <span className="text-green-500">Generated: <strong>{generatedCount}</strong></span>
          <span className="text-amber-500">Missing: <strong>{missingCount}</strong></span>
        </div>
        <Button
          onClick={generateAll}
          disabled={batchGenerating || missingCount === 0}
          className="bg-primary"
        >
          {batchGenerating ? (
            <><IconLoader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
          ) : (
            <>Generate All Missing ({missingCount})</>
          )}
        </Button>
      </div>

      {/* Cue Table */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium w-12">Status</th>
              <th className="px-4 py-2 text-left font-medium w-40">Cue ID</th>
              <th className="px-4 py-2 text-left font-medium">Text Preview</th>
              <th className="px-4 py-2 text-right font-medium w-24">Duration</th>
              <th className="px-4 py-2 text-right font-medium w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {speakCues.map(cue => {
              const exists = audioStatuses[cue.params.audioFileId];
              const isGenerating = generatingId === cue.id;
              return (
                <tr key={cue.id} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    {exists ? (
                      <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                        <IconCheck className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                        <IconX className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{cue.params.audioFileId}</td>
                  <td className="px-4 py-3 max-w-md truncate">{cue.params.text.substring(0, 80)}...</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{(cue.durationMs / 1000).toFixed(1)}s</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant={exists ? 'outline' : 'default'}
                      onClick={() => generateSingle(cue)}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : exists ? (
                        'Regenerate'
                      ) : (
                        <><IconVolume className="w-3.5 h-3.5 mr-1" /> Generate</>
                      )}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {speakCues.length === 0 && (
        <div className="flex flex-col items-center py-12 text-muted-foreground">
          <IconVolume className="h-12 w-12 mb-4 opacity-30" />
          <p>No lesson script found for {chapter} Band {band}.</p>
          <p className="text-xs mt-1">Generate the script first using <code>scripts/generate_lesson_script.ts</code></p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────
// Map Alignment Tab
// ─────────────────────────────────────────────────

interface MapTransform {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
}

interface AdminMap {
  mapId: string;
  pngKey: string;
  hasTransform: boolean;
  hasSvg: boolean;
  overlayKey: string | null;
}

function extractMapPrefix(value: string): string {
  return value.match(/^map_\d{3}/)?.[0] || value;
}

function MapAlignmentTab() {
  const [selectedMap, setSelectedMap] = useState<AdminMap | null>(null);
  const [transform, setTransform] = useState<MapTransform>({
    translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotate: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [overlayLoadError, setOverlayLoadError] = useState(false);

  const { data: mapsData, isLoading } = useQuery<{ maps: AdminMap[] }>({
    queryKey: ['admin-maps'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/maps`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load maps');

      const payload = await res.json() as { maps?: Array<Record<string, unknown>> };
      const rawMaps = Array.isArray(payload.maps) ? payload.maps : [];

      // Frontend safety net: if stale backend still returns overlay SVG cards,
      // map them back to their PNG card by numeric map prefix.
      const overlayByPrefix = new Map<string, string>();
      rawMaps.forEach((item) => {
        const key = typeof item.pngKey === 'string' ? item.pngKey : '';
        if (!key || !key.toLowerCase().endsWith('.svg')) return;

        const filename = key.split('/').pop() || '';
        const overlayId = filename.replace(/\.[^.]+$/, '');
        overlayByPrefix.set(extractMapPrefix(overlayId), key);
      });

      const normalizedMaps: AdminMap[] = rawMaps
        .filter((item) => {
          const key = typeof item.pngKey === 'string' ? item.pngKey : '';
          return !!key && key.toLowerCase().endsWith('.png');
        })
        .map((item) => {
          const mapId = typeof item.mapId === 'string' ? item.mapId : '';
          const pngKey = typeof item.pngKey === 'string' ? item.pngKey : '';
          const resolvedOverlay = typeof item.overlayKey === 'string' && item.overlayKey.length > 0
            ? item.overlayKey
            : overlayByPrefix.get(extractMapPrefix(mapId)) || null;

          return {
            mapId,
            pngKey,
            hasTransform: Boolean(item.hasTransform),
            hasSvg: Boolean(item.hasSvg) || Boolean(resolvedOverlay),
            overlayKey: resolvedOverlay,
          };
        });

      return { maps: normalizedMaps };
    },
  });

  const loadTransform = async (map: AdminMap) => {
    setSelectedMap(map);
    setSaved(false);
    setOverlayLoadError(false);
    try {
      const res = await fetch(`${API_URL}/api/admin/maps/${map.mapId}/transform`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTransform(data.transform);
      }
    } catch (e) {
      console.error('Failed to load transform:', e);
    }
  };

  const saveTransform = async () => {
    if (!selectedMap) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/maps/${selectedMap.mapId}/transform`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transform),
      });
      if (res.ok) setSaved(true);
    } catch (e) {
      console.error('Failed to save transform:', e);
    }
    setSaving(false);
  };

  const updateTransform = (key: keyof MapTransform, value: number) => {
    setTransform(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Map Grid */}
      {!selectedMap && (
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(mapsData?.maps || []).map((m: any) => (
                <Card
                  key={m.mapId}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => loadTransform(m)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[4/3] bg-muted rounded-md mb-3 overflow-hidden flex items-center justify-center">
                      <img
                        src={`${API_URL}/api/assets/${m.pngKey}`}
                        alt={m.mapId}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <h4 className="font-medium text-sm truncate" title={m.mapId}>{m.mapId}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${m.hasSvg ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                        {m.hasSvg ? 'SVG ✓' : 'No SVG'}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${m.hasTransform ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}`}>
                        {m.hasTransform ? 'Aligned ✓' : 'Not aligned'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!mapsData?.maps || mapsData.maps.length === 0) && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <IconMap2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No maps found in R2.</p>
                  <p className="text-xs mt-1">Upload map PNGs to <code>assets/maps/</code> in the ASSETS_BUCKET.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Alignment Editor */}
      {selectedMap && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => { setSelectedMap(null); setOverlayLoadError(false); }}>
                <IconArrowLeft className="h-4 w-4 mr-1" /> Back to maps
              </Button>
              <h3 className="font-medium text-lg">{selectedMap.mapId}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setTransform({ translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotate: 0 });
                  setSaved(false);
                }}
              >
                Reset
              </Button>
              <Button onClick={saveTransform} disabled={saving} className="bg-primary">
                {saving ? <IconLoader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                {saved ? 'Saved ✓' : 'Save Alignment'}
              </Button>
            </div>
          </div>

          {/* Preview area */}
          <div className="relative aspect-[3/2] bg-muted rounded-lg border overflow-hidden">
            {/* PNG base layer */}
            <img
              src={`${API_URL}/api/assets/${selectedMap.pngKey}`}
              alt={selectedMap.mapId}
              className="absolute inset-0 w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* SVG overlay with transform */}
            <div
              className="absolute inset-0 border-2 border-dashed border-primary/30 pointer-events-none"
              style={{
                transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scaleX}, ${transform.scaleY}) rotate(${transform.rotate}deg)`,
                transformOrigin: 'center center',
              }}
            >
              {selectedMap.overlayKey && !overlayLoadError ? (
                <img
                  src={`${API_URL}/api/assets/${selectedMap.overlayKey}`}
                  alt="SVG overlay"
                  className="w-full h-full object-contain opacity-60"
                  onError={() => setOverlayLoadError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/40 text-sm">
                  No SVG overlay uploaded
                </div>
              )}
            </div>
          </div>

          {/* Transform controls */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {([
              { key: 'translateX', label: 'X Offset', min: -500, max: 500, step: 1, unit: 'px' },
              { key: 'translateY', label: 'Y Offset', min: -500, max: 500, step: 1, unit: 'px' },
              { key: 'scaleX', label: 'Scale X', min: 0.1, max: 3, step: 0.01, unit: '×' },
              { key: 'scaleY', label: 'Scale Y', min: 0.1, max: 3, step: 0.01, unit: '×' },
              { key: 'rotate', label: 'Rotate', min: -180, max: 180, step: 0.5, unit: '°' },
            ] as const).map(ctrl => (
              <div key={ctrl.key} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex justify-between">
                  {ctrl.label}
                  <span className="font-mono">
                    {transform[ctrl.key as keyof MapTransform].toFixed(ctrl.step < 1 ? 2 : 0)}{ctrl.unit}
                  </span>
                </label>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={transform[ctrl.key as keyof MapTransform]}
                  onChange={e => updateTransform(ctrl.key as keyof MapTransform, parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Raw JSON preview */}
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Raw transform JSON</summary>
            <pre className="mt-2 p-3 bg-muted rounded-lg overflow-x-auto font-mono">
              {JSON.stringify(transform, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────
// Main Content Tools Page
// ─────────────────────────────────────────────────

export default function ContentTools() {
  const [tab, setTab] = useState<'audio' | 'maps'>('audio');
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <IconLoader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Tools</h2>
          <p className="text-muted-foreground">Generate audio, align maps, and manage lesson content.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/admin')}>
          <IconArrowLeft className="h-4 w-4 mr-1" /> Back to Admin
        </Button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border">
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'audio'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setTab('audio')}
        >
          <IconVolume className="w-4 h-4 inline mr-2" />
          Audio Generator
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'maps'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setTab('maps')}
        >
          <IconMap2 className="w-4 h-4 inline mr-2" />
          Map Alignment
        </button>
      </div>

      {/* Tab content */}
      {tab === 'audio' && <AudioGeneratorTab />}
      {tab === 'maps' && <MapAlignmentTab />}
    </div>
  );
}
