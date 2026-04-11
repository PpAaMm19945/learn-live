import { useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconLogout } from '@tabler/icons-react';
import { useAuthStore, useIsAdmin } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TeachingCanvas, type TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';
import { ImageScene } from '@/components/session/ImageScene';
import { handleToolCall, type ToolCallMessage } from '@/lib/canvas/toolCallHandler';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ToolPanel } from '@/components/admin/ToolPanel';
import { MapPresets } from '@/components/admin/MapPresets';
import { SceneControls, type WorkbenchSceneMode } from '@/components/admin/SceneControls';
import { ToolCallLog, type ToolLogEntry } from '@/components/admin/ToolCallLog';

export default function CanvasWorkbench() {
  const navigate = useNavigate();
  const canvasRef = useRef<TeachingCanvasRef>(null);
  const { name, email, logout } = useAuthStore();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { toast } = useToast();

  const [sceneMode, setSceneMode] = useState<WorkbenchSceneMode>('transcript');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [toolLog, setToolLog] = useState<ToolLogEntry[]>([]);

  const latest = useMemo(() => toolLog[toolLog.length - 1], [toolLog]);

  const addLog = (entry: Omit<ToolLogEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timestamp = `${now.toLocaleTimeString('en-US', { hour12: false })}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    setToolLog((prev) => [...prev.slice(-199), { id: crypto.randomUUID(), timestamp, ...entry }]);
  };

  const handleSceneChange = (mode: WorkbenchSceneMode, args?: Record<string, any>) => {
    setSceneMode(mode);

    if (mode === 'image') {
      setImageUrl(args?.imageUrl || imageUrl);
      setCaption(args?.caption || caption);
    }

    if (mode === 'timeline') {
      setSceneMode('map');
      addLog({ level: 'info', label: 'Scene changed', result: 'timeline routed to map for canvas overlays' });
      return;
    }

    addLog({ level: 'info', label: 'Scene changed', result: `now ${mode}` });
  };

  const dispatchTool = (message: ToolCallMessage) => {
    try {
      handleToolCall(canvasRef.current, message, (mode, args) => handleSceneChange(mode as WorkbenchSceneMode, args));
      addLog({ level: 'tool', label: message.tool, args: message.args, result: 'dispatched' });
    } catch (error) {
      addLog({ level: 'error', label: message.tool, args: message.args, result: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Signed out' });
    navigate('/login');
  };

  if (isAdminLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading…</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <header className="border-b bg-card/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} aria-label="Back">
            <IconArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Canvas Workbench</h1>
            <p className="text-xs text-muted-foreground">{name || email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}><IconLogout className="h-4 w-4 mr-2" />Sign out</Button>
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={38} minSize={28}>
          <div className="h-full overflow-auto border-r p-4 space-y-5">
            <SceneControls
              sceneMode={sceneMode}
              imageUrl={imageUrl}
              caption={caption}
              onSceneChange={handleSceneChange}
              onImageUrlChange={setImageUrl}
              onCaptionChange={setCaption}
            />
            <MapPresets onDispatch={dispatchTool} />
            <ToolPanel onDispatch={dispatchTool} />
            <ToolCallLog entries={toolLog} onClear={() => setToolLog([])} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={62} minSize={40}>
          <div className="relative h-full bg-background">
            {sceneMode === 'transcript' && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Transcript mode active — use controls to switch scenes or fire tools.
              </div>
            )}
            <div className={`absolute inset-0 ${sceneMode === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <TeachingCanvas ref={canvasRef} className="h-full w-full" />
            </div>
            {sceneMode === 'image' && <ImageScene imageUrl={imageUrl} caption={caption} />}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <footer className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <span>Scene: {sceneMode}</span>
        <span>Last call: {latest ? `${latest.label} (${latest.level.toUpperCase()})` : 'none'}</span>
      </footer>
    </div>
  );
}
