import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type LogLevel = 'tool' | 'info' | 'warn' | 'error';

export interface ToolLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  label: string;
  args?: Record<string, any>;
  result?: string;
}

interface ToolCallLogProps {
  entries: ToolLogEntry[];
  onClear: () => void;
}

const LEVEL_STYLES: Record<LogLevel, string> = {
  tool: 'bg-primary/15 text-primary border-primary/30',
  info: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  warn: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  error: 'bg-red-500/15 text-red-500 border-red-500/30',
};

function fallbackCopy(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve();
}

export function ToolCallLog({ entries, onClear }: ToolCallLogProps) {
  const [copyLabel, setCopyLabel] = useState('Copy All');

  const copyAll = async () => {
    const formatted = entries
      .map((entry) => `${entry.timestamp} ${entry.level.toUpperCase()} ${entry.label} ${entry.args ? JSON.stringify(entry.args) : ''} ${entry.result || ''}`)
      .join('\n');

    try {
      await fallbackCopy(formatted);
      setCopyLabel('Copied!');
    } catch {
      setCopyLabel('Failed');
    }
    setTimeout(() => setCopyLabel('Copy All'), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Tool Call Log</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyAll} disabled={!entries.length}>{copyLabel}</Button>
          <Button variant="outline" size="sm" onClick={onClear} disabled={!entries.length}>Clear Log</Button>
        </div>
      </div>
      <div className="max-h-64 overflow-auto rounded-md border bg-muted/20 p-2 space-y-2">
        {!entries.length && (
          <p className="text-xs text-muted-foreground px-2 py-4">No tool calls yet.</p>
        )}
        {entries.map((entry) => (
          <details key={entry.id} className="rounded border bg-background/80 p-2">
            <summary className="flex items-center gap-2 text-xs cursor-pointer list-none">
              <span className="font-mono text-muted-foreground">{entry.timestamp}</span>
              <Badge variant="outline" className={LEVEL_STYLES[entry.level]}>{entry.level.toUpperCase()}</Badge>
              <span className="font-medium">{entry.label}</span>
            </summary>
            {(entry.args || entry.result) && (
              <div className="mt-2 space-y-2 text-xs">
                {entry.args && <pre className="overflow-auto rounded bg-muted/50 p-2">{JSON.stringify(entry.args, null, 2)}</pre>}
                {entry.result && <p className="text-muted-foreground">{entry.result}</p>}
              </div>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}
