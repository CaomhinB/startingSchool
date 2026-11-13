'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import AvatarSvg from './Avatar';
import Classroom from './Classroom';
import Maker from './Maker';
import WalkPair from './WalkPair';
import { Avatar, defaultAvatar, JUMPER, shade } from '@/lib/avatar';
import { nextScene, Scene, SCENES, TALK } from '@/lib/scenes';

const Bg = ({ src }: { src: string }) => <img className="bg" src={`/img/${src}.webp`} alt="" draggable={false} />;

function Hot({ x, y, w, h, label, onClick, round, quiet }: { x: number; y: number; w: number; h: number; label: string; onClick: () => void; round?: boolean; quiet?: boolean }) {
  return (
    <button className={`hot ${quiet ? '' : 'sparkle'} ${round ? 'round' : ''}`} aria-label={label} onClick={onClick}
      style={round ? { left: `${x}%`, top: `${y}%`, width: `${w}%`, transform: 'translate(-50%, -50%)' } : { left: `${x - w / 2}%`, top: `${y - h / 2}%`, width: `${w}%`, height: `${h}%` }} />
  );
}
const Sticker = ({ a, x, y, w }: { a: Avatar; x: number; y: number; w: number }) => (
  <div className="sticker pop" style={{ left: `${x - w / 2}%`, top: `${y}%`, width: `${w}%` }}>
    <span className="photoart" />
    <AvatarSvg a={a} crop="head" />
  </div>
);
/** A highlight that follows an exact shape, for things that are not rectangles. */
function HotPoly({ pts, label, onClick }: { pts: [number, number][]; label: string; onClick: () => void }) {
  const pointStr = pts.map(([x, y]) => `${(x * 10).toFixed(1)},${(y * 6.71).toFixed(1)}`).join(' ');
  const path = `M${pointStr.split(' ').join(' L')} Z`;
  return (
    <svg className="hotpoly" viewBox="0 0 1000 671">
      <polygon className="hpshape" points={pointStr} role="button" aria-label={label} tabIndex={0}
        onClick={onClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }} />
      <path className="hpstar" d="M0,-20 C3,-6 6,-3 20,0 C6,3 3,6 0,20 C-3,6 -6,3 -20,0 C-6,-3 -3,-6 0,-20z">
        <animateMotion dur="4.5s" repeatCount="indefinite" path={path} />
      </path>
    </svg>
  );
}

const Bag = ({ x, y, colour }: { x: number; y: number; colour: string }) => (
  <svg className="bag" viewBox="0 0 60 92" style={{ left: `${x}%`, top: `${y - 7.24}%`, ['--dx' as string]: `${50 - x}cqw`, ['--dy' as string]: '46cqw' }} aria-hidden="true">
    <path d="M30 2c-10 0-17 7-17 16v10h9v-10c0-4.4 3.6-8 8-8s8 3.6 8 8v10h9v-10c0-9-7-16-17-16z" fill={shade(colour, -30)} />
    <rect x="4" y="26" width="52" height="62" rx="14" fill={colour} />
    <path d="M4 42c0-9 7-16 16-16h20c9 0 16 7 16 16v2c0 4-3 7-7 7H11c-4 0-7-3-7-7z" fill="#00000022" />
    <rect x="12" y="56" width="36" height="24" rx="8" fill="#ffffff35" />
    <rect x="24" y="46" width="12" height="10" rx="3" fill="#f6cf3f" />
    <rect x="26.5" y="48" width="7" height="6" rx="2" fill="#c9a52c" />
  </svg>
);

const Next = ({ onClick }: { onClick: () => void }) => <button className="go next pop" aria-label="Next" onClick={onClick}>›</button>;
const Hint = ({ children }: { children: ReactNode }) => <div className="hint">{children}</div>;

const HELP = 8;

/** One music player for the whole page, kept on window so nothing can start a second copy. */
function getTune(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { __schoolTune?: HTMLAudioElement };
  if (!w.__schoolTune) {
    const a = new Audio('/audio/Starting_school.mp3');
    a.loop = true;
    a.volume = 0.5;
    w.__schoolTune = a;
  }
  return w.__schoolTune;
}

/** Wave goodbye: slide the hand all the way across, then all the way back. */
function Wave({ onDone }: { onDone: () => void }) {
  const band = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const [x, setX] = useState(0);
  const [backward, setBackward] = useState(false);
  const [dragging, setDragging] = useState(false);

  const moveTo = (v: number) => {
    if (finished.current) return;
    setX(v);
    if (!backward && v > 0.88) setBackward(true);
    else if (backward && v < 0.12) { finished.current = true; setDragging(false); onDone(); }
  };
  const put = (clientX: number) => {
    const r = band.current?.getBoundingClientRect();
    if (r) moveTo(Math.max(0, Math.min(1, (clientX - r.left) / r.width)));
  };

  return (
    <div
      className="band" ref={band}
      onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); setDragging(true); put(e.clientX); }}
      onPointerMove={(e) => { if (dragging) put(e.clientX); }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <span className="track" />
      <span className={`goal ${backward ? '' : 'on'}`} style={{ right: '0%' }}>★</span>
      <span className={`goal ${backward ? 'on' : ''}`} style={{ left: '0%' }}>★</span>
      <button
        className={`hand ${dragging ? 'held' : ''}`} style={{ left: `${x * 100}%` }}
        aria-label="Slide to wave goodbye"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') moveTo(Math.min(1, x + 0.25));
          if (e.key === 'ArrowLeft') moveTo(Math.max(0, x - 0.25));
        }}
      />
    </div>
  );
}

/** The register: the teacher calls a few other children first, then you. */
// spot: where that child is sitting, so their "Here!" pops up over them
const CLASSMATES: { name: string; a: Avatar; spot: [number, number] }[] = [
  { name: 'Mary', spot: [13, 48], a: { ...defaultAvatar, skin: 1, hairStyle: 1, hairColour: 4, face: 1, headwear: 0, jumper: 0, bottoms: 1 } },
  { name: 'John', spot: [22, 44.5], a: { ...defaultAvatar, skin: 2, hairStyle: 2, hairColour: 1, face: 0, headwear: 0, jumper: 0, bottoms: 0 } },
  { name: 'Simon', spot: [38, 45.5], a: { ...defaultAvatar, skin: 4, hairStyle: 0, hairColour: 0, face: 1, headwear: 2, jumper: 0, bottoms: 2 } },
  { name: 'Helen', spot: [49.5, 43.5], a: { ...defaultAvatar, skin: 0, hairStyle: 3, hairColour: 2, face: 3, headwear: 0, jumper: 0, bottoms: 1 } },
  { name: 'Garry', spot: [68, 50], a: { ...defaultAvatar, skin: 5, hairStyle: 2, hairColour: 5, face: 4, headwear: 4, jumper: 0, bottoms: 0 } },
];
const MY_SPOT: [number, number] = [61, 45];

function Register({ avatar, name, onNext }: { avatar: Avatar; name: string; onNext: () => void }) {
  const [list] = useState(() => [...CLASSMATES].sort(() => Math.random() - 0.5).slice(0, 3));
  const [begun, setBegun] = useState(false);
  const [turn, setTurn] = useState(0);
  const [said, setSaid] = useState(false);
  const [mine, setMine] = useState(false);

  // a quiet moment with an empty bubble before the first name is called
  useEffect(() => {
    const t = setTimeout(() => setBegun(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!begun || turn >= list.length) return;
    const a = setTimeout(() => setSaid(true), 1100);
    const b = setTimeout(() => { setSaid(false); setTurn((t) => t + 1); }, 2100);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [begun, turn, list.length]);

  const mineTurn = turn >= list.length;
  const who = mineTurn ? { name: name || 'You', a: avatar, spot: MY_SPOT } : list[turn];

  return (
    <>
      <Bg src="register" />
      {!begun && <div className="callout"><span className="bubble" /></div>}
      {begun && (
      <div className="callout" key={mineTurn ? 'me' : who.name}>
        {mineTurn && !mine ? (
          <button className="bubble sparkle" aria-label="Say here" onClick={() => setMine(true)}>
            <AvatarSvg a={avatar} crop="head" />
          </button>
        ) : (
          <span className="bubble"><AvatarSvg a={who.a} crop="head" /></span>
        )}
        <b className="rname">{who.name}</b>
      </div>
      )}
      {(said || mine) && <div className="here pop" style={{ left: `${who.spot[0]}%`, top: `${who.spot[1]}%` }}>Here!</div>}
      {mine && <Next onClick={onNext} />}
      <Hint>
        {!begun
          ? 'Sit nicely. The teacher is about to call the register.'
          : !mineTurn
          ? 'The teacher is calling the register. Listen for your name.'
          : mine
            ? 'Well done. Everyone is here today.'
            : `That is you${name ? `, ${name}` : ''}! Tap your picture to say \u201cHere!\u201d`}
      </Hint>
    </>
  );
}

/** The walk to school: the child walks to the school, then the teacher waves them in. */
const School = () => (
  <div className="school">
    <span className="flag" />
    <span className="roof" />
    <span className="wall">
      <span className="win" /><span className="win" /><span className="win" /><span className="win" />
      <span className="sdoor" />
      <b className="sign">School</b>
    </span>
  </div>
);

const Teacher = () => (
  <svg className="teacher" viewBox="0 0 130 300" aria-hidden="true">
    <ellipse cx="62" cy="292" rx="34" ry="6" fill="#000" opacity=".14" />
    <rect x="47" y="172" width="15" height="110" rx="7.5" fill="#434a5c" />
    <rect x="65" y="172" width="15" height="110" rx="7.5" fill="#434a5c" />
    <ellipse cx="54" cy="286" rx="12" ry="6.5" fill="#24252e" />
    <ellipse cx="73" cy="286" rx="12" ry="6.5" fill="#24252e" />
    <rect x="28" y="94" width="14" height="66" rx="7" fill="#e3a23c" />
    <circle cx="35" cy="163" r="8.5" fill="#c08457" />
    <rect x="36" y="86" width="54" height="92" rx="18" fill="#e3a23c" />
    <rect x="55" y="88" width="16" height="88" fill="#fdf4e3" />
    <circle cx="63" cy="122" r="2.6" fill="#c98f33" /><circle cx="63" cy="142" r="2.6" fill="#c98f33" />
    <g className="tarm">
      <rect x="84" y="48" width="13" height="52" rx="6.5" transform="rotate(25 90 100)" fill="#e3a23c" />
      <circle cx="112" cy="53" r="9" fill="#c08457" />
    </g>
    <rect x="56" y="74" width="14" height="14" rx="4" fill="#a86c44" />
    <circle cx="62" cy="52" r="26" fill="#c08457" />
    <circle cx="54" cy="50" r="3.6" fill="#2b2119" /><circle cx="70" cy="50" r="3.6" fill="#2b2119" />
    <circle cx="47" cy="61" r="5" fill="#ff8f9e" opacity=".3" /><circle cx="77" cy="61" r="5" fill="#ff8f9e" opacity=".3" />
    <path d="M56,62 q6,7 12,0" stroke="#8a2f3a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    <path d="M36,50 a26,26 0 0 1 52,0 q-10,-13 -26,-11.5 q-16,-1.5 -26,11.5z" fill="#32251d" />
    <circle cx="40" cy="32" r="8.5" fill="#32251d" />
  </svg>
);

function Walk({ avatar, name, onNext }: { avatar: Avatar; name: string; onNext: () => void }) {
  const [beat, setBeat] = useState<'walk' | 'greet'>('walk');
  useEffect(() => {
    if (beat !== 'walk') return;
    const t = setTimeout(() => setBeat('greet'), 6200);
    return () => clearTimeout(t);
  }, [beat]);

  if (beat === 'walk') {
    return (
      <div className="outside">
        <span className="sun" />
        <span className="cloud c1" /><span className="cloud c2" />
        <span className="hill" />
        <School />
        <span className="road" />
        <div className="walker"><WalkPair a={avatar} /></div>
        <h1>Off we go to school{name ? `, ${name}` : ''}!</h1>
        <button className="pill skip" onClick={() => setBeat('greet')}>Skip ›</button>
      </div>
    );
  }
  return (
    <div className="entrance">
      <span className="cut" />
      <span className="eroof" />
      <span className="ewall" />
      <span className="ewin left" /><span className="ewin right" />
      <span className="earch"><span className="edoor" /></span>
      <b className="welcome">Welcome</b>
      <span className="steps" />
      <Teacher />
      <div className="arrived"><AvatarSvg a={avatar} /></div>
      <p className="speech">Good morning{name ? `, ${name}` : ''}! Come on in.</p>
      <Next onClick={onNext} />
    </div>
  );
}

export default function Game() {
  const [scene, setScene] = useState<Scene>('start');
  const [avatar, setAvatar] = useState<Avatar>(defaultAvatar);
  const [pick, setPick] = useState<number | null>(null);
  const [phase, setPhase] = useState(0);
  const [menu, setMenu] = useState(false);
  const [help, setHelp] = useState<number | null>(null);
  const [talk, setTalk] = useState(false);
  const [debug, setDebug] = useState(false);
  const [music, setMusic] = useState(true);

  // Handy for checking: add ?scene=classroom or ?debug to the address.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get('scene') as Scene | null;
    if (s && SCENES.includes(s)) setScene(s);
    setDebug(q.has('debug'));
  }, []);

  const musicOn = useRef(true);
  useEffect(() => {
    musicOn.current = music;
    const a = getTune();
    if (!a) return;
    if (music) a.play().catch(() => {});
    else a.pause();
  }, [music]);

  // Start the music from the top as soon as the page opens. Some browsers hold
  // sound back until the screen is touched, so try again on the first tap.
  useEffect(() => {
    const a = getTune();
    if (!a) return;
    a.currentTime = 0;
    const tryPlay = () => { if (musicOn.current) a.play().catch(() => {}); };
    tryPlay();
    const kinds = ['pointerdown', 'touchstart', 'keydown'] as const;
    const once = () => { tryPlay(); kinds.forEach((k) => window.removeEventListener(k, once)); };
    kinds.forEach((k) => window.addEventListener(k, once, { passive: true }));
    return () => kinds.forEach((k) => window.removeEventListener(k, once));
  }, []);

  const go = (s: Scene) => { setScene(s); setPick(null); setPhase(0); setTalk(false); setMenu(false); };
  const startTune = () => { const a = getTune(); if (a && music) a.play().catch(() => {}); };
  const next = () => go(nextScene(scene));
  const name = avatar.name.trim();

  let body: ReactNode = null;
  if (scene === 'start') {
    body = (
      <>
        <Bg src="start" />
        <div className="title"><small>PLAY THE STORY</small><b>Starting</b><b className="two">School</b></div>
        <Hot x={50} y={87.4} w={11.6} h={0} round label="Play" onClick={() => { startTune(); next(); }} />
        <Hot x={86.6} y={7.6} w={6.8} h={0} round quiet label={music ? 'Turn the music off' : 'Turn the music on'}
          onClick={() => { setMusic(!music); if (!music) startTune(); }} />
        {!music && <span className="muted" />}
        <Hot x={94.9} y={7.6} w={6.8} h={0} round quiet label="Menu" onClick={() => setMenu(true)} />
        <button className="pill howto" onClick={() => setHelp(0)}>? How to play</button>
      </>
    );
  } else if (scene === 'make') {
    body = <Maker avatar={avatar} onChange={setAvatar} onDone={next} />;
  } else if (scene === 'photo') {
    body = (
      <>
        <Bg src="photo" />
        <div className={`phone ${phase ? 'flash' : ''}`}>{phase === 1 && <span className="photoart" />}<AvatarSvg a={avatar} /></div>
        <Hot x={6.8} y={10.5} w={8} h={0} round quiet label="Menu" onClick={() => setMenu(true)} />
        <Hot x={49.9} y={74.5} w={6.5} h={0} round label="Take your picture" onClick={() => { setPhase(1); setTimeout(next, 2000); }} />
        <Hint>{phase === 0 ? 'Smile! Tap the button to take your picture' : 'What a lovely picture!'}</Hint>
      </>
    );
  } else if (scene === 'walk') {
    body = <Walk avatar={avatar} name={name} onNext={next} />;
  } else if (scene === 'peg') {
    const pegs = [
      { x: 47.5, ky: 44.85, rw: 5.6, px: 50.7, w: 6.5 },
      { x: 57, ky: 44.3, rw: 5.8, px: 60.6, w: 8 },
      { x: 68.9, ky: 43.8, rw: 6.2, px: 73.4, w: 10 },
      { x: 86, ky: 43, rw: 6.6, px: 91, w: 12.5 },
    ];
    body = (
      <>
        <Bg src="peg2" />
        <img className={`bg ${pick === null ? '' : 'letgo'}`} src="/img/peg.webp" alt="" draggable={false} />
        {pegs.map((p, i) => <Hot key={i} x={p.x} y={p.ky} w={p.rw} h={0} round label={`Peg ${i + 1}`} onClick={() => setPick(i)} />)}
        {pick !== null && (
          <>
            <Bag x={pegs[pick].x} y={pegs[pick].ky} colour="#641513" />
            <Sticker a={avatar} x={pegs[pick].px} y={30 - pegs[pick].w * 0.745} w={pegs[pick].w} />
            <Next onClick={next} />
          </>
        )}
        <Hint>{pick === null ? 'Tap a peg to hang your bag on' : 'That is your peg now!'}</Hint>
      </>
    );
  } else if (scene === 'tray') {
    const ys = [26, 50.5, 75], ly = [22.8, 47.6, 72.2];
    body = (
      <>
        <Bg src="tray" />
        {ys.map((y, i) => <Hot key={i} x={50} y={y} w={43} h={19} label={`Tray ${i + 1}`} onClick={() => setPick(i)} />)}
        {pick !== null && <><Sticker a={avatar} x={50} y={ly[pick]} w={8.6} /><Next onClick={next} /></>}
        <Hint>{pick === null ? 'Tap a tray to make it yours' : 'Your picture is on your tray!'}</Hint>
      </>
    );
  } else if (scene === 'bottle') {
    const xs = [13.8, 26.8, 40.5, 54.2, 67.7, 81.5, 94.6];
    body = (
      <>
        <Bg src="bottle" />
        {xs.map((x, i) => <Hot key={i} x={x} y={52} w={11} h={40} label={`Bottle ${i + 1}`} onClick={() => setPick(i)} />)}
        {pick !== null && <><div className="tag pop" style={{ left: `${Math.min(xs[pick], 88)}%`, top: '24%' }}>★ {name || 'Mine'}</div><Next onClick={next} /></>}
        <Hint>{pick === null ? 'Tap the bottle you like best' : 'Great choice!'}</Hint>
      </>
    );
  } else if (scene === 'door') {
    body = (
      <>
        <Bg src="door" />
        {phase === 0 && <Wave onDone={() => setPhase(1)} />}
        {phase === 1 && <HotPoly label="Classroom door" onClick={next}
          pts={[[35.3, 25.2], [53.2, 24.2], [53.4, 84.9], [35.4, 84.6]]} />}
        <Hint>
          {phase === 0
            ? 'Wave goodbye to your grown-up. Slide the hand all the way over, then all the way back.'
            : 'What a big wave! Your teacher is waving hello. Tap the door to go in.'}
        </Hint>
      </>
    );
  } else if (scene === 'register') {
    body = <Register avatar={avatar} name={name} onNext={next} />;
  } else if (scene === 'classroom') {
    body = <Classroom a={avatar} name={name} onFinish={next} />;
  } else {
    body = (
      <div className="walk end">
        <div className="walker still"><AvatarSvg a={avatar} /></div>
        <h1>Lovely playing{name ? `, ${name}` : ''}!</h1>
        <p className="note">Tidy up, lunch, the playground and home time are coming next.</p>
        <button className="pill again" onClick={() => go('start')}>Play again</button>
      </div>
    );
  }

  const prompt = TALK[scene];
  return (
    <main className="viewport">
      <div className={`stage ${debug ? 'debug' : ''}`}>
        <div className="inner" key={scene}>
          {body}
          {scene !== 'start' && <button className={`pause ${scene === 'photo' || scene === 'register' ? 'p2' : ''}`} aria-label="Pause" onClick={() => setMenu(true)}><i /><i /></button>}
          {prompt && (
            <div className="talk">
              <button className="pill" aria-expanded={talk} onClick={() => setTalk(!talk)}>💬 Talk about it</button>
              {talk && <p className="pop">{prompt}</p>}
            </div>
          )}
        </div>
        {menu && (
          <div className="overlay" role="dialog" aria-label="Paused">
            <div className="card">
              <h2>Paused</h2>
              <button className="pill big" onClick={() => setMenu(false)}>Keep playing</button>
              <button className="pill big" onClick={() => { setMusic(!music); if (!music) startTune(); }}>{music ? '🔈 Music off' : '🔊 Music on'}</button>
              <button className="pill big" onClick={() => { setMenu(false); setHelp(0); }}>How to play</button>
              <button className="pill big" onClick={() => { setAvatar(defaultAvatar); go('start'); }}>Start again</button>
            </div>
          </div>
        )}
        {help !== null && (
          <div className="overlay help" role="dialog" aria-label="How to play">
            <img src={`/img/help${help + 1}.webp`} alt="How to play" draggable={false} />
            {help > 0 && <button className="arrow left" aria-label="Back" onClick={() => setHelp(help - 1)}>‹</button>}
            {help < HELP - 1 && <button className="arrow right" aria-label="Next" onClick={() => setHelp(help + 1)}>›</button>}
            <button className="pause close" aria-label="Close" onClick={() => setHelp(null)}>✕</button>
          </div>
        )}
      </div>
    </main>
  );
}
