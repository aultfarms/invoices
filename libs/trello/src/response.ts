// POST /cards/{id}/idLabels returns the card's label ids (strings), not a card,
// list, or board. A 200 from that call still means the label was saved.
export function idLabelsWriteSucceeded(path: string, body: unknown): boolean {
  const barePath = path.split('?')[0] ?? path;
  if (!/\/idLabels\/?$/.test(barePath)) return false;
  if (Array.isArray(body)) {
    return body.every(item => typeof item === 'string' || isLabelRecord(item));
  }
  if (isLabelRecord(body)) return true;
  if (!body || typeof body !== 'object') return false;
  return typeof (body as { id?: unknown }).id === 'string';
}

function isLabelRecord(item: unknown): boolean {
  if (!item || typeof item !== 'object') return false;
  const label = item as { id?: unknown, color?: unknown };
  return typeof label.id === 'string'
    && (label.color === undefined || typeof label.color === 'string')
    && !('idList' in item);
}
