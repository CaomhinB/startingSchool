'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import AvatarSvg from './Avatar';
import { Avatar } from '@/lib/avatar';

export type ActivityId = 'paint' | 'build' | 'puzzle' | 'jar' | 'clock' | 'story' | 'hoop';

/* ---------- shared drag and drop board: no failing, pieces snap when close ---------- */
type Piece = { id: string; sx: number; sy: number; tx: number; ty: number; w: number; h: number; node: ReactNode };

function DragBoard({ pieces, onDone }: { pieces: Piece[]; onDone: () => void }) {
  const board = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() => Object.fromEntries(pieces.map((p) => [p.id, { x: p.sx, y: p.sy, locked: false }])));
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const pct = (e: React.PointerEvent) => {
    const r = board.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };
  const down = (e: React.PointerEvent, p: Piece) => {
    if (pos[p.id].locked) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const m = pct(e);
    drag.current = { id: p.id, dx: m.x - pos[p.id].x, dy: m.y - pos[p.id].y };
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const m = pct(e);
    setPos((s) => ({ ...s, [d.id]: { ...s[d.id], x: m.x - d.dx, y: m.y - d.dy } }));
  };
  const up = (p: Piece) => {
    if (!drag.current) return;
    drag.current = null;
    setPos((s) => {
      const cur = s[p.id];
      const near = Math.hypot(cur.x - p.tx, cur.y - p.ty) < 9;
      const next = { ...s, [p.id]: near ? { x: p.tx, y: p.ty, locked: true } : cur };
      if (Object.values(next).every((v) => v.locked)) setTimeout(onDone, 350);
      return next;
    });
  };

  return (
    <div className="board" ref={board}>
      {pieces.map((p) => (
        <div key={'s' + p.id} className="slot" style={{ left: `${p.tx}%`, top: `${p.ty}%`, width: `${p.w}%`, height: `${p.h}%` }} />
      ))}
      {pieces.map((p) => (
        <div
          key={p.id}
          className={`piece ${pos[p.id].locked ? 'locked' : ''}`}
          style={{ left: `${pos[p.id].x}%`, top: `${pos[p.id].y}%`, width: `${p.w}%`, height: `${p.h}%` }}
          onPointerDown={(e) => down(e, p)} onPointerMove={move} onPointerUp={() => up(p)} onPointerCancel={() => up(p)}
        >
          {p.node}
        </div>
      ))}
    </div>
  );
}

/* ---------- Build: finish the bridge ---------- */
function Build({ onDone }: { onDone: () => void }) {
  const block = (n: string, c: string) => <div className="block" style={{ background: c }}>{n}</div>;
  return (
    <>
      <div className="pillar" style={{ left: '27%' }} /><div className="pillar" style={{ left: '61%' }} />
      <DragBoard
        onDone={onDone}
        pieces={[
          { id: 'a', sx: 5, sy: 58, tx: 27, ty: 38, w: 12, h: 16, node: block('1', '#f6cf3f') },
          { id: 'b', sx: 83, sy: 58, tx: 61, ty: 38, w: 12, h: 16, node: block('2', '#58b7e8') },
          { id: 'c', sx: 20, sy: 86, tx: 27, ty: 25, w: 46, h: 13, node: block('3', '#ef7b6c') },
        ]}
      />
    </>
  );
}

/* ---------- Puzzle: four big pieces ---------- */
function Puzzle({ onDone }: { onDone: () => void }) {
  const tile = (c: number, r: number) => (
    <div className="tile" style={{ backgroundImage: 'url(/img/door.webp)', backgroundPosition: `${c * 100}% ${r * 100}%` }} />
  );
  return (
    <DragBoard
      onDone={onDone}
      pieces={[
        { id: 'tl', sx: 73, sy: 52, tx: 28, ty: 22, w: 22, h: 30, node: tile(0, 0) },
        { id: 'tr', sx: 4, sy: 56, tx: 50, ty: 22, w: 22, h: 30, node: tile(1, 0) },
        { id: 'bl', sx: 74, sy: 18, tx: 28, ty: 52, w: 22, h: 30, node: tile(0, 1) },
        { id: 'br', sx: 3, sy: 20, tx: 50, ty: 52, w: 22, h: 30, node: tile(1, 1) },
      ]}
    />
  );
}

/* ---------- Paint: finger painting ---------- */
const PAINTS = ['#e53e4f', '#2f6fe0', '#f6cf3f', '#3fa34d', '#9a4fc4', '#f08a2b'];

/** A different thing to colour in each time. */
const OUTLINES = [
  <g key="flower">
    {[0, 60, 120, 180, 240, 300].map((d) => <ellipse key={d} cx="100" cy="38" rx="11" ry="17" transform={`rotate(${d} 100 60)`} />)}
    <circle cx="100" cy="60" r="9" />
    <path d="M100,86 v52 M100,118 q-22,-2 -26,-18 q20,0 26,18 M100,126 q22,-2 26,-18 q-20,0 -26,18" />
  </g>,
  <g key="car">
    <path d="M26,100 v-18 q0,-8 8,-9 l28,-3 l16,-16 q4,-4 10,-4 h44 q7,0 9,6 l6,16 l14,4 q8,2 8,10 v14" />
    <path d="M86,56 h34 v18 h-34 z M74,100 h52" />
    <circle cx="62" cy="100" r="13" /><circle cx="138" cy="100" r="13" />
  </g>,
  <g key="ball">
    <circle cx="100" cy="75" r="46" />
    <path d="M100,29 q-24,46 0,92 M100,29 q24,46 0,92 M54,75 q46,-24 92,0 M54,75 q46,24 92,0" />
  </g>,
  <g key="castle">
    <path d="M44,126 V62 h24 v64 M44,62 v-9 h8 v9 m8,0 v-9 h8 v9" />
    <path d="M132,126 V62 h24 v64 M132,62 v-9 h8 v9 m8,0 v-9 h8 v9" />
    <path d="M68,126 V86 h64 v40 M68,86 v-7 h10 v7 m11,0 v-7 h10 v7 m11,0 v-7 h10 v7" />
    <path d="M88,126 v-20 a12,12 0 0 1 24,0 v20" />
    <path d="M56,53 v-19 M56,34 l16,6 l-16,6" />
  </g>,
  <g key="robot">
    <path d="M100,36 v-9" /><circle cx="100" cy="23" r="4" />
    <rect x="78" y="36" width="44" height="36" rx="7" />
    <circle cx="89" cy="52" r="4" /><circle cx="111" cy="52" r="4" />
    <path d="M90,64 h20 M94,72 v6 h12 v-6" />
    <rect x="74" y="78" width="52" height="38" rx="8" />
    <circle cx="100" cy="92" r="4" /><path d="M88,104 h24" />
    <path d="M74,84 h-16 v24 M126,84 h16 v24 M86,116 v14 h-10 M114,116 v14 h10" />
  </g>,
];

function Paint({ onDone }: { onDone: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [colour, setColour] = useState(PAINTS[0]);
  const [pic, setPic] = useState(() => Math.floor(Math.random() * OUTLINES.length));
  const used = useRef(false);
  useEffect(() => {
    const c = cv.current!;
    c.width = c.clientWidth * 2; c.height = c.clientHeight * 2;
  }, []);
  const dab = (e: React.PointerEvent) => {
    if (e.type === 'pointermove' && e.buttons === 0 && e.pointerType === 'mouse') return;
    const c = cv.current!, r = c.getBoundingClientRect(), g = c.getContext('2d')!;
    g.fillStyle = colour; g.globalAlpha = 0.85;
    g.beginPath();
    g.arc(((e.clientX - r.left) / r.width) * c.width, ((e.clientY - r.top) / r.height) * c.height, c.width * 0.028, 0, Math.PI * 2);
    g.fill();
    if (!used.current) { used.current = true; onDone(); }
  };
  const fresh = () => {
    const c = cv.current!;
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
    setPic((old) => {
      let n = old;
      while (n === old) n = Math.floor(Math.random() * OUTLINES.length);
      return n;
    });
  };
  return (
    <>
      <div className="paper">
        <canvas ref={cv} onPointerDown={dab} onPointerMove={dab} />
        <svg viewBox="0 0 200 150" className="outline" aria-hidden>
          <g fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {OUTLINES[pic]}
          </g>
        </svg>
      </div>
      <div className="pots">
        {PAINTS.map((p) => (
          <button key={p} className={`pot ${p === colour ? 'on' : ''}`} style={{ background: p }} aria-label="Paint colour" onClick={() => setColour(p)} />
        ))}
        <button className="pill" onClick={fresh}>New paper</button>
      </div>
    </>
  );
}

/* ---------- Calm jar ---------- */
const GLITTER = ['#f6cf3f', '#ff7fb0', '#58c7e8', '#6fd08a'];
function Jar({ onDone }: { onDone: () => void }) {
  const [bits, setBits] = useState<{ c: string; x: number; rest: number; up: number; d: number }[]>([]);
  const [shaken, setShaken] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const add = (c: string) =>
    setBits((b) => [...b, ...Array.from({ length: 7 }, () => ({ c, x: 8 + Math.random() * 80, rest: Math.random() * 14, up: 15 + Math.random() * 70, d: Math.random() * 0.5 }))].slice(-90));
  const shake = () => {
    if (!bits.length) return;
    setShaken(true); onDone();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShaken(false), 900);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <>
      <div className={`jar ${shaken ? 'shaking' : ''}`} onPointerMove={(e) => (e.buttons || e.pointerType !== 'mouse') && shake()} onClick={shake} role="button" aria-label="Shake the calm jar">
        <div className="lid" />
        <div className="glass">
          {bits.map((b, i) => (
            <span key={i} className="bit" style={{ left: `${b.x}%`, bottom: `${shaken ? b.up : b.rest}%`, background: b.c, transitionDelay: `${b.d}s`, transitionDuration: shaken ? '.5s' : '4s' }} />
          ))}
        </div>
      </div>
      <div className="bowls">
        {GLITTER.map((c) => (
          <button key={c} className="bowl" aria-label="Add glitter" onClick={() => add(c)}><span style={{ background: c }} /></button>
        ))}
      </div>
    </>
  );
}

/* ---------- Tell the time ---------- */
function Clock({ onDone }: { onDone: () => void }) {
  const [hour, setHour] = useState(12);
  const target = 3;
  useEffect(() => { if (hour === target) onDone(); }, [hour, onDone]);
  return (
    <>
      <svg viewBox="0 0 200 200" className="clock">
        <circle cx="100" cy="100" r="96" fill="#fff" stroke="#7a6fd0" strokeWidth="6" />
        {Array.from({ length: 12 }, (_, i) => {
          const n = i + 1, t = (n * 30 - 90) * (Math.PI / 180), x = 100 + 74 * Math.cos(t), y = 100 + 74 * Math.sin(t);
          return (
            <g key={n} onClick={() => setHour(n)} style={{ cursor: 'pointer' }} role="button" aria-label={`${n} o'clock`}>
              <circle cx={x} cy={y} r="15" fill={n === hour ? '#ffe9a6' : '#f1effc'} />
              <text x={x} y={y + 6} textAnchor="middle" fontSize="17" fontWeight="800" fill="#4a3fa0">{n}</text>
            </g>
          );
        })}
        <line x1="100" y1="100" x2="100" y2="34" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <line x1="100" y1="100" x2="100" y2="56" stroke="#e53e4f" strokeWidth="7" strokeLinecap="round" style={{ transform: `rotate(${hour * 30}deg)`, transformOrigin: '100px 100px', transition: 'transform .5s' }} />
        <circle cx="100" cy="100" r="7" fill="#333" />
      </svg>
      <p className="clocksay">{hour === target ? 'Yes! That is 3 o’clock. Home time!' : `That is ${hour} o’clock. Can you find 3?`}</p>
    </>
  );
}

/* ---------- Story time: pick your favourite book ---------- */
function Story({ name, onDone }: { name: string; onDone: () => void }) {
  const [typed, setTyped] = useState('');
  const [book, setBook] = useState('');
  const title = typed.replace(/[^\p{L}\p{N} '!?,.&-]/gu, '').replace(/\s+/g, ' ').trimStart().slice(0, 28);
  const choose = () => { if (title.trim()) { setBook(title.trim()); onDone(); } };

  if (!book) {
    return (
      <div className="storybox">
        <label htmlFor="bk">Which book would you choose?</label>
        <div className="row">
          <input id="bk" value={typed} autoComplete="off" placeholder="Your favourite book"
            onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && choose()} />
          <button className="go small" aria-label="Choose this book" onClick={choose} disabled={!title.trim()}>›</button>
        </div>
        <small>Tap the arrow when you have typed it</small>
      </div>
    );
  }
  return (
    <div className="storybox">
      <div className="book">
        <span className="spine" />
        <div className="cover">
          <span className="art" />
          <b>{book}</b>
          <small>A story for {name || 'you'}</small>
        </div>
      </div>
      <p className="well">Good choice{name ? `, ${name}` : ''}!</p>
    </div>
  );
}

/* ---------- Hoops: swing your hips and keep it spinning ---------- */
function Hoop({ a, onDone }: { a: Avatar; onDone: () => void }) {
  const [fast, setFast] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const push = () => {
    setFast(true);
    onDone();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFast(false), 2600);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <>
      <button className={`hooper ${fast ? 'fast' : ''}`} aria-label="Swing the hoop" onClick={push}>
        <svg className="ring back" viewBox="0 0 200 90" aria-hidden="true">
          <path d="M8,45 A92,34 0 0 1 192,45" fill="none" stroke="#e08529" strokeWidth="11" />
          <path d="M8,45 A92,34 0 0 1 192,45" fill="none" stroke="#f0bb36" strokeWidth="5" strokeDasharray="42 42" />
        </svg>
        <span className="hula"><AvatarSvg a={a} /></span>
        <svg className="ring front" viewBox="0 0 200 90" aria-hidden="true">
          <path d="M8,45 A92,34 0 0 0 192,45" fill="none" stroke="#ff9d3f" strokeWidth="11" />
          <path d="M8,45 A92,34 0 0 0 192,45" fill="none" stroke="#ffd23f" strokeWidth="5" strokeDasharray="42 42" />
        </svg>
      </button>
      <p className="clocksay">{fast ? 'Round and round it goes!' : 'Tap your character to swing the hoop'}</p>
    </>
  );
}

const INFO: Record<ActivityId, { title: string; hint: string }> = {
  paint: { title: 'Paint!', hint: 'Tap a colour, then tap the paper to finger paint' },
  build: { title: 'Build!', hint: 'Drag the blocks to build a bridge' },
  puzzle: { title: 'Puzzle!', hint: 'Drag the pieces into place' },
  jar: { title: 'Shake!', hint: 'Tap the bowls, then swipe the jar to shake it' },
  clock: { title: 'Tell the time', hint: 'Home time is 3 o’clock. Tap the 3 to move the little hand' },
  story: { title: 'Story time!', hint: 'Type the book you would choose' },
  hoop: { title: 'Hoop time!', hint: 'Keep the hoop going round and round' },
};

export default function Activity({ id, a, name, onClose, onDone, done }: { id: ActivityId; a: Avatar; name: string; onClose: () => void; onDone: () => void; done: boolean }) {
  return (
    <div className="activity" onPointerDown={(e) => e.stopPropagation()}>
      <h2>{INFO[id].title} {done && <span className="star">★</span>}</h2>
      <p className="sub">{INFO[id].hint}</p>
      {id === 'paint' && <Paint onDone={onDone} />}
      {id === 'build' && <Build onDone={onDone} />}
      {id === 'puzzle' && <Puzzle onDone={onDone} />}
      {id === 'jar' && <Jar onDone={onDone} />}
      {id === 'clock' && <Clock onDone={onDone} />}
      {id === 'story' && <Story name={name} onDone={onDone} />}
      {id === 'hoop' && <Hoop a={a} onDone={onDone} />}
      <button className="go back" onClick={onClose} aria-label="Back to the classroom">✓</button>
    </div>
  );
}
