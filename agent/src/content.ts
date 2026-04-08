import fs from 'fs';
import path from 'path';

export interface Beat {
  beatId: string;
  sectionId: string;
  sequence: number;
  title: string;
  contentText: string;
  sceneMode: 'transcript' | 'map' | 'image' | 'overlay';
  toolSequence: Array<{
    tool: string;
    args: Record<string, any>;
    syncTrigger: 'start_of_beat';
  }>;
  estimatedDurationSec: number;
  bandOverrides?: Record<string, { contentText: string }>;
}

export interface SectionManifest {
  sectionId: string;
  chapterId: string;
  heading: string;
  totalBeats: number;
  beats: Beat[];
}

export class ContentLoader {
  private static contentDir = path.join(process.cwd(), '../docs/curriculum/history');

  static async loadSection(chapterId: string, sectionId: string): Promise<SectionManifest | null> {
    const filename = `${chapterId}_${sectionId}.json`;
    const fullPath = path.join(this.contentDir, filename);

    if (!fs.existsSync(fullPath)) {
      console.warn(`[CONTENT] Section file not found: ${fullPath}`);
      return null;
    }

    try {
      const data = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(data) as SectionManifest;
    } catch (e) {
      console.error(`[CONTENT] Failed to parse section ${sectionId}:`, e);
      return null;
    }
  }

  static getBeatForBand(beat: Beat, band: number): string {
    if (beat.bandOverrides && beat.bandOverrides[band.toString()]) {
      return beat.bandOverrides[band.toString()].contentText;
    }
    return beat.contentText;
  }
}
