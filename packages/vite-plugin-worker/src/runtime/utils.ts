function random(l: number, r: number): number {
  return l + Math.round(Math.random() * (r - l));
}

const character_table = '0123456789abcdefghijklmnopqrstuvwxyz';
export function randomString(length = 8): string {
  return Array.apply(null, Array(length))
    .map(() => character_table[random(0, character_table.length - 1)])
    .join('');
}