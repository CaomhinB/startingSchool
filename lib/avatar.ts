// Everything about the child's character. No names or choices ever leave the browser.
export type Avatar = {
  skin: number; hairStyle: number; hairColour: number; face: number;
  headwear: number; jumper: number; bottoms: number; name: string;
};
export type ChoiceKey = Exclude<keyof Avatar, 'name'>;

export const SKIN = ['#fbd9c4', '#eeb694', '#d99a74', '#b9785a', '#8f5637', '#5e3a26'];
export const HAIR = ['#1c1a1a', '#4a2c1a', '#7a3f1d', '#d6741f', '#e3b254', '#f7e3a4'];
export const JUMPER = ['#3f9e98', '#e04848', '#2d3f86', '#f6cf3f', '#3fa34d', '#9a4fc4'];
export const HAIR_STYLES = ['Curly', 'Bob', 'Short', 'Braids', 'Buns', 'Long'];
export const FACES = ['Big smile', 'Smile', 'Calm', 'Freckles', 'Cheeky grin'];
export const HEADWEAR = ['None', 'Round glasses', 'Square glasses', 'Headphones', 'Hearing aid', 'Bow'];
export const BOTTOMS = ['Shorts', 'Skirt', 'Trousers', 'Wheelchair'];

export const STEPS: { key: ChoiceKey | 'name'; title: string; count: number; zoom: boolean }[] = [
  { key: 'skin', title: 'Skin', count: SKIN.length, zoom: true },
  { key: 'hairStyle', title: 'Hair style', count: HAIR_STYLES.length, zoom: true },
  { key: 'hairColour', title: 'Hair colour', count: HAIR.length, zoom: true },
  { key: 'face', title: 'Face', count: FACES.length, zoom: true },
  { key: 'headwear', title: 'Head wear', count: HEADWEAR.length, zoom: true },
  { key: 'jumper', title: 'Jumper colour', count: JUMPER.length, zoom: false },
  { key: 'bottoms', title: 'Almost ready!', count: BOTTOMS.length, zoom: false },
  { key: 'name', title: 'Your name', count: 0, zoom: false },
];

export const defaultAvatar: Avatar = {
  skin: 3, hairStyle: 0, hairColour: 1, face: 1, headwear: 0, jumper: 0, bottoms: 1, name: '',
};

const LIMITS: Record<ChoiceKey, number> = {
  skin: SKIN.length, hairStyle: HAIR_STYLES.length, hairColour: HAIR.length, face: FACES.length,
  headwear: HEADWEAR.length, jumper: JUMPER.length, bottoms: BOTTOMS.length,
};

/** Returns a new avatar with one choice changed. Out-of-range values are ignored. */
export function setChoice(a: Avatar, key: ChoiceKey, value: number): Avatar {
  if (!Number.isInteger(value) || value < 0 || value >= LIMITS[key]) return a;
  return { ...a, [key]: value };
}

/** Letters, spaces, hyphens and apostrophes only. 12 characters at most. */
export function cleanName(raw: string): string {
  return raw.replace(/[^\p{L} '\-]/gu, '').replace(/\s+/g, ' ').trimStart().slice(0, 12);
}

/** The skirt means a girl. Every other choice means a boy. */
export function isGirl(a: Avatar): boolean {
  return a.bottoms === 1;
}

export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + amt));
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
