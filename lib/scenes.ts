export const SCENES = ['start', 'make', 'photo', 'walk', 'peg', 'tray', 'bottle', 'door', 'register', 'classroom', 'end'] as const;
export type Scene = (typeof SCENES)[number];

export function nextScene(s: Scene): Scene {
  const i = SCENES.indexOf(s);
  return SCENES[Math.min(i + 1, SCENES.length - 1)];
}

/** One gentle question per scene for the grown-up to ask. */
export const TALK: Partial<Record<Scene, string>> = {
  make: 'What do you like most about how you look?',
  walk: 'How will we get to school?',
  peg: 'Where will your coat and bag go?',
  tray: 'What would you like to keep in your tray?',
  bottle: 'When might you want a drink at school?',
  door: 'How do you feel about saying goodbye? I will always come back.',
  register: 'What could you say when you hear your name?',
  classroom: 'Which one do you want to try first at real school?',
};
