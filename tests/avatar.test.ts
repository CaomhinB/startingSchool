import { describe, expect, it } from 'vitest';
import { cleanName, defaultAvatar, FACES, isGirl, setChoice, shade } from '../lib/avatar';
import { nextScene, SCENES } from '../lib/scenes';

describe('character state', () => {
  it('changes one choice and leaves the rest', () => {
    const a = setChoice(defaultAvatar, 'jumper', 2);
    expect(a.jumper).toBe(2);
    expect(a.skin).toBe(defaultAvatar.skin);
    expect(defaultAvatar.jumper).toBe(0);
  });
  it('ignores choices that do not exist', () => {
    expect(setChoice(defaultAvatar, 'skin', 99)).toBe(defaultAvatar);
    expect(setChoice(defaultAvatar, 'skin', -1)).toBe(defaultAvatar);
    expect(setChoice(defaultAvatar, 'face', 1.5)).toBe(defaultAvatar);
  });
  it('cleans names', () => {
    expect(cleanName('  Willow<script>')).toBe('Willowscript');
    expect(cleanName('Anne-Marie O\'Neil the third')).toHaveLength(12);
    expect(cleanName('Zoë 123')).toBe('Zoë ');
  });
  it('shades colours without leaving the valid range', () => {
    expect(shade('#ffffff', 20)).toBe('#ffffff');
    expect(shade('#000000', -20)).toBe('#000000');
  });
});

describe('scene order', () => {
  it('moves forward one scene at a time and stops at the end', () => {
    expect(nextScene('start')).toBe('make');
    expect(nextScene('register')).toBe('classroom');
    expect(nextScene('end')).toBe('end');
    expect(SCENES[0]).toBe('start');
  });
});

describe('girl or boy', () => {
  it('reads the skirt as a girl and everything else as a boy', () => {
    expect(isGirl({ ...defaultAvatar, bottoms: 1 })).toBe(true);
    expect(isGirl({ ...defaultAvatar, bottoms: 0 })).toBe(false);
    expect(isGirl({ ...defaultAvatar, bottoms: 2 })).toBe(false);
    expect(isGirl({ ...defaultAvatar, bottoms: 3 })).toBe(false);
  });
  it('offers five faces', () => {
    expect(FACES).toHaveLength(5);
    expect(setChoice(defaultAvatar, 'face', 4).face).toBe(4);
    expect(setChoice(defaultAvatar, 'face', 5)).toBe(defaultAvatar);
  });
});
