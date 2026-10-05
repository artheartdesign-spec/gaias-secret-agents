// Export helper for the Secret Postcard prototype.
// Kept separate until the prototype is approved for production.
export function wrapCanvasText(ctx, text, maxWidth) {
  const words = String(text || '').trim().split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}
