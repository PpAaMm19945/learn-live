/**
 * Strip markdown formatting from text for display in UI elements
 * like breadcrumbs, titles, and navigation where markdown rendering
 * is not appropriate.
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')  // bold
    .replace(/\*(.+?)\*/g, '$1')       // italic
    .replace(/^#{1,6}\s+/gm, '')       // headings
    .replace(/`(.+?)`/g, '$1')         // inline code
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
    .trim();
}
