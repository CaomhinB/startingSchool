import { Avatar, HAIR, JUMPER, shade, SKIN } from '@/lib/avatar';

/**
 * The walk to school, seen from the side: a grown-up holding the child's hand.
 * If the child chose a wheelchair, the grown-up pushes instead.
 */
export default function WalkPair({ a }: { a: Avatar }) {
  const skin = SKIN[a.skin], skinD = shade(skin, -26);
  const hair = HAIR[a.hairColour], hairD = shade(hair, -20);
  const jumper = JUMPER[a.jumper], jumperD = shade(jumper, -26);
  const coat = '#a85b86', coatD = shade(coat, -22);
  const legs = '#4a5163', legsD = shade(legs, -14);
  const grey = '#666b78';
  const chair = a.bottoms === 3;
  const skirt = a.bottoms === 1;

  // a shoe with its toe to the right, so each figure clearly faces forward
  const shoe = (x: number, y: number, k: number, dark: string) => (
    <path d={`M${x - 9 * k},${y - 7 * k} h${9 * k} q${17 * k},0 ${17 * k},${8 * k} q0,${4 * k} ${-4 * k},${4 * k} h${-22 * k} q${-4 * k},0 ${-4 * k},${-5 * k} z`} fill={dark} />
  );

  const face = (cx: number, cy: number, r: number) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={skin} />
      <path d={`M${cx + r * 0.92},${cy - r * 0.1} q${r * 0.3},${r * 0.16} ${r * 0.04},${r * 0.3} z`} fill={skinD} />
      <circle cx={cx + r * 0.42} cy={cy - r * 0.12} r={r * 0.13} fill="#1b1410" />
      <circle cx={cx + r * 0.2} cy={cy + r * 0.42} r={r * 0.2} fill="#ff7f8f" opacity=".3" />
      <path d={`M${cx + r * 0.5},${cy + r * 0.38} q${r * 0.22},${r * 0.18} ${r * 0.42},${-r * 0.06}`} stroke="#8a2f3a" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
    </g>
  );

  return (
    <svg className="pair" viewBox="0 0 280 320" role="img" aria-label="Walking to school together">
      <ellipse cx="90" cy="300" rx="52" ry="7" fill="#000" opacity=".12" />
      <ellipse cx="195" cy="302" rx="48" ry="7" fill="#000" opacity=".12" />

      {/* the grown-up */}
      <g className="mleg b"><rect x="58" y="192" width="17" height="100" rx="8.5" fill={legsD} />{shoe(68, 296, 1, "#22232b")}</g>
      <g className="mleg f"><rect x="76" y="192" width="17" height="100" rx="8.5" fill={legs} />{shoe(86, 296, 1, "#2d2f3a")}</g>
      <g className="marm b"><rect x="40" y="114" width="15" height="68" rx="7.5" fill={coatD} /></g>
      <path d="M58,86 q-26,20 -22,54 q0,10 10,10 q6,0 6,-10 q-2,-26 14,-40z" fill={hairD} />
      <rect x="44" y="100" width="56" height="102" rx="22" fill={coat} />
      <rect x="44" y="140" width="56" height="8" fill={coatD} opacity=".45" /><path d="M44,122 q-2,40 2,78 q-8,-4 -8,-22 q-2,-34 6,-56z" fill={coatD} opacity=".5" />
      {face(72, 74, 30)}
      <path d="M44,74 a30,30 0 0 1 56,-14 q-18,-10 -36,-2 q-16,8 -20,24z" fill={hair} />
      {a.headwear === 1 && <g fill="rgba(255,255,255,.2)" stroke="#e0453a" strokeWidth="3"><circle cx="88" cy="70" r="12" /><path d="M76,68 h-10" /></g>}
      <path d="M90,116 L124,194" stroke={coat} strokeWidth="16" strokeLinecap="round" fill="none" />
      <circle cx="126" cy="196" r="10" fill={skin} />

      {chair ? (
        <g>
          {/* the child, seated */}
          <rect x="150" y="150" width="14" height="74" rx="7" fill={grey} />
          <path d="M150,158 q-14,-4 -16,6" stroke={grey} strokeWidth="9" fill="none" strokeLinecap="round" />
          <g className="karm"><rect x="168" y="186" width="13" height="44" rx="6.5" fill={jumperD} /></g>
          <rect x="160" y="176" width="46" height="56" rx="16" fill={jumper} />
          <rect x="196" y="214" width="52" height="15" rx="7" fill={grey} />
          <rect x="236" y="222" width="15" height="32" rx="6" fill={legs} />
          {shoe(247, 258, 0.86, "#22232b")}
          <rect x="158" y="226" width="80" height="12" rx="6" fill="#7d8496" />
          {face(182, 148, 27)}
          <path d="M155,148 a27,27 0 0 1 50,-13 q-16,-9 -32,-2 q-14,7 -18,15z" fill={hair} />
          <g className="wheel"><circle cx="196" cy="256" r="44" fill="none" stroke="#3f4350" strokeWidth="7" />
            {[0, 45, 90, 135].map((d) => <line key={d} x1="196" y1="212" x2="196" y2="300" stroke="#9aa1b3" strokeWidth="3" transform={`rotate(${d} 196 256)`} />)}
            <circle cx="196" cy="256" r="7" fill="#9aa1b3" />
          </g>
          <circle cx="250" cy="286" r="14" fill="none" stroke="#3f4350" strokeWidth="6" />
        </g>
      ) : (
        <g>
          {/* the child, walking */}
          <g className="kleg b"><rect x="162" y="238" width="15" height="58" rx="7.5" fill={skirt ? '#3c3f52' : grey} />{shoe(171, 299, 0.86, "#22232b")}</g>
          <g className="kleg f"><rect x="178" y="238" width="15" height="58" rx="7.5" fill={skirt ? '#484c61' : grey} />{shoe(187, 299, 0.86, "#2d2f3a")}</g>
          {skirt && <path d="M156,228 h44 l10,26 q-32,8 -64,0z" fill={grey} />}
          <g className="karm b"><rect x="152" y="190" width="14" height="50" rx="7" fill={jumperD} /></g>
          <rect x="155" y="178" width="44" height="66" rx="18" fill={jumper} />
          <rect x="155" y="236" width="44" height="9" rx="4" fill={jumperD} opacity=".5" /><path d="M155,196 v44 q-6,-6 -6,-24 q0,-14 6,-20z" fill={jumperD} opacity=".55" />
          {face(180, 150, 27)}
          <path d="M153,150 a27,27 0 0 1 50,-13 q-16,-9 -32,-2 q-14,7 -18,15z" fill={hair} /><path d="M198,136 q9,3 7,13 q-5,-8 -13,-7z" fill={hairD} />
          {a.hairStyle === 5 && <path d="M153,148 q-8,30 2,44 l14,-2 q-10,-20 -4,-42z" fill={hairD} />}
          {a.hairStyle === 3 && <circle cx="155" cy="166" r="9" fill={hairD} />}
          {a.hairStyle === 4 && <circle cx="160" cy="124" r="11" fill={hairD} />}
          {a.headwear === 1 && <g fill="rgba(255,255,255,.2)" stroke="#e0453a" strokeWidth="3"><circle cx="195" cy="146" r="11" /><path d="M184,144 h-9" /></g>}
          {a.headwear === 2 && <g fill="rgba(255,255,255,.2)" stroke="#2f6fd0" strokeWidth="3"><rect x="184" y="136" width="22" height="19" rx="5" /><path d="M184,144 h-9" /></g>}
          {a.headwear === 3 && <g><path d="M156,146 a26,26 0 0 1 48,-12" stroke="#7a4fd0" strokeWidth="7" fill="none" strokeLinecap="round" /><rect x="150" y="138" width="16" height="30" rx="8" fill="#7a4fd0" /></g>}
          {a.headwear === 4 && <circle cx="168" cy="160" r="5" fill="#2f9be0" />}
          {a.headwear === 5 && <g fill="#e2343c"><path d="M160,122 l-16,-9 v18z" /><path d="M160,122 l16,-9 v18z" /><circle cx="160" cy="122" r="5.5" fill="#b9222b" /></g>}
          <path d="M162,192 L132,196" stroke={jumper} strokeWidth="14" strokeLinecap="round" fill="none" />
          <circle cx="130" cy="196" r="8.5" fill={skin} />
        </g>
      )}
    </svg>
  );
}
