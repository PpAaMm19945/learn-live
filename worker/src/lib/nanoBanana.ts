/**
 * Nano Banana Image Generation — Task 13.9
 * Uses Gemini 2.5 Flash Image model via Lovable AI Gateway
 * to generate on-demand diagrams for the Explainer Canvas.
 *
 * Called by the worker when the agent requests generate_diagram.
 */

export async function generateDiagram(
  apiKey: string,
  prompt: string,
): Promise<{ imageUrl: string | null; error?: string }> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a simple, clean educational diagram for a child: ${prompt}. 
              Style: flat design, bright colors, minimal text, white background. 
              Suitable for ages 6-12.`
            }]
          }],
          generationConfig: {
            responseModalities: ['IMAGE'],
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('[NANOBNN] Gemini image gen failed:', errText);
      return { imageUrl: null, error: errText };
    }

    const data: any = await response.json();
    const imageData = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData;

    if (imageData) {
      const imageUrl = `data:${imageData.mimeType};base64,${imageData.data}`;
      return { imageUrl };
    }

    return { imageUrl: null, error: 'No image in response' };
  } catch (err: any) {
    console.error('[NANOBNN] Image generation error:', err);
    return { imageUrl: null, error: err.message };
  }
}
