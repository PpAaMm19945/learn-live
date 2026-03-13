import { Env } from '../index';

export interface WorldContextEntry {
  id: string;
  chapter_id: string;
  region: string;
  title: string;
  description: string;
  start_year: number;
  end_year: number;
  display_order: number;
}

export async function handleGetWorldContext(request: Request, env: Env, chapterId: string): Promise<Response> {
  try {
    const stmt = env.DB.prepare(
      `SELECT * FROM World_Context WHERE chapter_id = ? ORDER BY start_year ASC`
    ).bind(chapterId);

    const { results } = await stmt.all<WorldContextEntry>();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching world context:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch world context' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
