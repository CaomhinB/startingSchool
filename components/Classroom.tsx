'use client';
import { useRef, useState } from 'react';
import Activity, { ActivityId } from './activities';
import { Avatar } from '@/lib/avatar';

// The room image is 5241 x 1000. The stage is 2528 x 1696. So the room is this many stages wide:
const ROOM_W = (5241 / 1000) * (1696 / 2528) * 100; // in % of stage width
const TRAVEL = ((ROOM_W - 100) / ROOM_W) * 100; // how far the room can slide, in % of its own width

type Spot = { id: string; x: number; y: number; w: number; h: number; label: string; activity?: ActivityId; say?: string };
// x, y = centre of the spot in % of the room image. Add ?debug to the address to see the boxes.
const SPOTS: Spot[] = [
  { id: 'story', x: 19.5, y: 86, w: 11, h: 22, label: 'Story corner', activity: 'story' },
  { id: 'jar', x: 23.5, y: 58, w: 7, h: 20, label: 'Calm jars', activity: 'jar' },
  { id: 'paint', x: 36.5, y: 76, w: 10, h: 34, label: 'Painting table', activity: 'paint' },
  { id: 'hoops', x: 52, y: 76, w: 10, h: 34, label: 'Hoops', activity: 'hoop' },
  { id: 'fish', x: 72, y: 51, w: 5.5, h: 15, label: 'Fish tank', say: 'Blub blub. The fish say hello!' },
  { id: 'build', x: 80.8, y: 78, w: 9, h: 32, label: 'Building blocks', activity: 'build' },
  { id: 'clock', x: 82.6, y: 28, w: 4.5, h: 18, label: 'Numbers wall', activity: 'clock' },
  { id: 'puzzle', x: 92.2, y: 88, w: 9, h: 20, label: 'Puzzle mat', activity: 'puzzle' },
];
const BUTTERFLY = [{ x: 8, y: 30 }, { x: 31, y: 18 }, { x: 61, y: 22 }, { x: 76, y: 20 }, { x: 96, y: 34 }];

export default function Classroom({ a, name, onFinish }: { a: Avatar; name: string; onFinish: () => void }) {
  const [x, setX] = useState(0.45); // 0 = far left, 1 = far right. Start on the teacher.
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState<ActivityId | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [say, setSay] = useState('');
  const [fly] = useState(() => BUTTERFLY[Math.floor(Math.random() * BUTTERFLY.length)]);
  const wrap = useRef<HTMLDivElement>(null);
  const d = useRef<{ startX: number; startPos: number; moved: boolean } | null>(null);
  const sayTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const mark = (id: string) => setDone((s) => (s.includes(id) ? s : [...s, id]));
  const speak = (t: string) => { setSay(t); clearTimeout(sayTimer.current); sayTimer.current = setTimeout(() => setSay(''), 2600); };

  const down = (e: React.PointerEvent) => { d.current = { startX: e.clientX, startPos: x, moved: false }; };
  const move = (e: React.PointerEvent) => {
    if (!d.current) return;
    const dx = e.clientX - d.current.startX;
    if (!d.current.moved && Math.abs(dx) < 8) return;
    d.current.moved = true; setDragging(true);
    const stageW = wrap.current!.clientWidth;
    setX(clamp(d.current.startPos - dx / (stageW * (ROOM_W / 100 - 1))));
  };
  const up = () => { setTimeout(() => { d.current = null; }, 0); setDragging(false); };
  const tap = (s: Spot) => {
    if (d.current?.moved) return; // it was a swipe, not a tap
    if (s.activity) setOpen(s.activity);
    else { speak(s.say!); mark(s.id); }
  };

  return (
    <div className="room-wrap" ref={wrap} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}>
      <div className={`room ${dragging ? 'dragging' : ''}`} style={{ width: `${ROOM_W}%`, transform: `translateX(${-x * TRAVEL}%)` }}>
        <img src="/img/classroom.webp" alt="A bright classroom with children playing" draggable={false} />
        {SPOTS.map((s) => (
          <button key={s.id} className="hot sparkle" aria-label={s.label} onClick={() => tap(s)}
            style={{ left: `${s.x - s.w / 2}%`, top: `${s.y - s.h / 2}%`, width: `${s.w}%`, height: `${s.h}%` }}>
            {done.includes(s.id) && <span className="star">★</span>}
          </button>
        ))}
        <button className={`butterfly ${done.includes('fly') ? 'found' : ''}`} aria-label="Butterfly" style={{ left: `${fly.x}%`, top: `${fly.y}%` }}
          onClick={() => { if (!d.current?.moved) { mark('fly'); speak('You found the butterfly!'); } }}>
          <svg viewBox="0 0 40 30"><ellipse cx="11" cy="10" rx="10" ry="9" fill="#ff8fc0" /><ellipse cx="29" cy="10" rx="10" ry="9" fill="#ff8fc0" /><ellipse cx="13" cy="22" rx="7" ry="6" fill="#ffc26f" /><ellipse cx="27" cy="22" rx="7" ry="6" fill="#ffc26f" /><rect x="18.5" y="5" width="3" height="21" rx="1.5" fill="#5a3b2a" /></svg>
        </button>
      </div>
      {x > 0.01 && <button className="arrow left" aria-label="Look left" onClick={() => setX(clamp(x - 0.28))}>‹</button>}
      {x < 0.99 && <button className="arrow right" aria-label="Look right" onClick={() => setX(clamp(x + 0.28))}>›</button>}
      {say && <div className="toast">{say}</div>}
      {!open && <div className="hint">Swipe to look around. Tap anything that sparkles.</div>}
      {!open && <button className="pill finish" onClick={onFinish}>Finished playing ›</button>}
      {open && <Activity id={open} a={a} name={name} done={done.includes(open)} onDone={() => mark(open)} onClose={() => setOpen(null)} />}
    </div>
  );
}
