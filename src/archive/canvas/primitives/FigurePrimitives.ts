import { HistoryCanvasElement } from './index';

/**
 * Creates a rounded card element for a historical figure.
 * @param id Unique identifier for the element.
 * @param name The name of the figure.
 * @param title The figure's role, title, or brief description.
 * @param portraitUrl Optional URL to a portrait or icon.
 * @param x Positional x-coordinate.
 * @param y Positional y-coordinate.
 * @returns A HistoryCanvasElement representing a figure card.
 */
export function createFigureCard(
  id: string,
  name: string,
  title: string,
  portraitUrl: string | undefined,
  x: number,
  y: number
): HistoryCanvasElement {
  return {
    id,
    type: 'figure_card',
    x,
    y,
    content: portraitUrl, // Store image URL in the native content property if present
    meta: {
      isFigureCard: true,
      name,
      title
    }
  };
}

/**
 * Creates a speech bubble element anchored to a historical figure.
 * @param id Unique identifier for the element.
 * @param figureId ID of the figure element this bubble belongs to.
 * @param quote The text quote.
 * @param x Positional x-coordinate.
 * @param y Positional y-coordinate.
 * @returns A HistoryCanvasElement representing a speech bubble.
 */
export function createSpeechBubble(
  id: string,
  figureId: string,
  quote: string,
  x: number,
  y: number
): HistoryCanvasElement {
  return {
    id,
    type: 'speech_bubble',
    x,
    y,
    content: quote,
    meta: {
      isSpeechBubble: true,
      figureId
    }
  };
}

/**
 * Creates a side-by-side layout element for comparing historical figures.
 * @param id Unique identifier for the element.
 * @param figures An array of figure IDs to be compared.
 * @returns A HistoryCanvasElement representing a comparison panel.
 */
export function createComparisonPanel(
  id: string,
  figures: string[]
): HistoryCanvasElement {
  return {
    id,
    type: 'group',
    x: 0,
    y: 0,
    children: figures,
    meta: {
      isComparisonPanel: true
    }
  };
}
