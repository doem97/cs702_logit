/**
 * Color generation for log streams.
 * Each stream gets a distinct color based on a hash of its id.
 */

const PALETTE = [
  '#4A90D9', // blue
  '#E57373', // red
  '#81C784', // green
  '#FFB74D', // orange
  '#BA68C8', // purple
  '#4DD0E1', // cyan
  '#F06292', // pink
  '#AED581', // light green
  '#FFD54F', // amber
  '#7986CB', // indigo
  '#A1887F', // brown
  '#90A4AE', // blue grey
  '#FF8A65', // deep orange
  '#4DB6AC', // teal
  '#DCE775', // lime
  '#9575CD', // deep purple
];

let colorIndex = 0;
const assignedColors = new Map<string, string>();

export function getStreamColor(streamId: string): string {
  if (assignedColors.has(streamId)) {
    return assignedColors.get(streamId)!;
  }
  const color = PALETTE[colorIndex % PALETTE.length];
  colorIndex++;
  assignedColors.set(streamId, color);
  return color;
}

export function setStreamColor(streamId: string, color: string): void {
  assignedColors.set(streamId, color);
}

export function resetColors(): void {
  colorIndex = 0;
  assignedColors.clear();
}
