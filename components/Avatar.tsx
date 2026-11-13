import { Avatar, HAIR, JUMPER, SKIN, shade } from '@/lib/avatar';

/** The child's character, drawn in layers so every part can be recoloured instantly. */
export default function AvatarSvg({ a, crop = 'full', className }: { a: Avatar; crop?: 'full' | 'head'; className?: string }) {
  const skin = SKIN[a.skin], skinD = shade(skin, -22), skinL = shade(skin, 14);
  const hair = HAIR[a.hairColour], hairD = shade(hair, -18), hairL = shade(hair, 22);
  const jumper = JUMPER[a.jumper], jumperD = shade(jumper, -24), jumperL = shade(jumper, 18);
  const grey = '#666b78', greyD = '#4d515c';
  const id = `av${a.skin}${a.hairColour}${a.jumper}`;
  const cap = 'M46,82 a54,56 0 0 1 108,0 q-10,-30 -54,-32 q-44,2 -54,32z';
  const fringe = 'M46,84 a54,56 0 0 1 108,0 l0,-10 q-54,-16 -108,0z';
  const curls = Array.from({ length: 13 }, (_, i) => {
    const t = (205 - i * (230 / 12)) * (Math.PI / 180);
    return { x: 100 + 56 * Math.cos(t), y: 80 - 56 * Math.sin(t) };
  });
  const topCurls = Array.from({ length: 6 }, (_, i) => {
    const t = (155 - i * 26) * (Math.PI / 180);
    return { x: 100 + 44 * Math.cos(t), y: 82 - 46 * Math.sin(t) };
  });
  const seated = a.bottoms === 3;

  return (
    <svg className={className} viewBox={crop === 'head' ? '20 0 160 160' : '0 0 200 320'} role="img" aria-label="Your character">
      <defs>
        <radialGradient id={`${id}s`} cx="40%" cy="35%" r="75%"><stop offset="0" stopColor={skinL} /><stop offset="1" stopColor={skin} /></radialGradient>
        <linearGradient id={`${id}j`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={jumperL} /><stop offset="1" stopColor={jumper} /></linearGradient>
        <radialGradient id={`${id}h`} cx="40%" cy="25%" r="80%"><stop offset="0" stopColor={hairL} /><stop offset="1" stopColor={hair} /></radialGradient>
      </defs>

      {/* hair behind the head */}
      <g fill={hairD}>
        {a.hairStyle === 0 && curls.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="21" />)}
        {a.hairStyle === 1 && <rect x="38" y="26" width="124" height="104" rx="52" />}
        {a.hairStyle === 4 && <><circle cx="56" cy="30" r="19" /><circle cx="144" cy="30" r="19" /></>}
        {a.hairStyle === 5 && <rect x="38" y="26" width="124" height="150" rx="46" />}
      </g>

      {/* body */}
      {crop === 'full' && (
        <g>
          <ellipse cx="100" cy="302" rx="62" ry="8" fill="#000" opacity=".12" />
          {seated && (
            <g>
              <rect x="62" y="146" width="76" height="82" rx="12" fill="#7d8496" />
              <rect x="56" y="226" width="88" height="13" rx="6" fill="#656b7a" />
              <g transform="rotate(-7 44 250)">
                <ellipse cx="44" cy="250" rx="8.5" ry="43" fill="#33363f" />
                <ellipse cx="44" cy="250" rx="3.6" ry="36" fill="#7a8192" />
              </g>
              <g transform="rotate(7 156 250)">
                <ellipse cx="156" cy="250" rx="8.5" ry="43" fill="#33363f" />
                <ellipse cx="156" cy="250" rx="3.6" ry="36" fill="#7a8192" />
              </g>
              <rect x="52" y="238" width="96" height="7" rx="3.5" fill="#656b7a" />
              <ellipse cx="74" cy="282" rx="5" ry="15" fill="#2b2e36" />
              <ellipse cx="126" cy="282" rx="5" ry="15" fill="#2b2e36" />
              <rect x="66" y="290" width="68" height="9" rx="4.5" fill="#3f4350" />
            </g>
          )}
          {!seated && a.bottoms === 0 && (
            <g>
              <rect x="76" y="232" width="19" height="58" rx="8" fill={skin} /><rect x="105" y="232" width="19" height="58" rx="8" fill={skin} />
              <rect x="76" y="270" width="19" height="16" fill="#fff" /><rect x="105" y="270" width="19" height="16" fill="#fff" />
              <path d="M68,206 h64 v32 q0,6 -6,6 h-20 l-6,-14 l-6,14 h-20 q-6,0 -6,-6z" fill={grey} />
            </g>
          )}
          {!seated && a.bottoms === 1 && (
            <g>
              <rect x="77" y="236" width="18" height="54" rx="8" fill="#3c3f52" /><rect x="105" y="236" width="18" height="54" rx="8" fill="#3c3f52" />
              <path d="M68,206 h64 l12,40 q-44,10 -88,0z" fill={grey} />
              <path d="M84,210 l-4,36 M100,210 v38 M116,210 l4,36" stroke={greyD} strokeWidth="2" fill="none" />
            </g>
          )}
          {!seated && a.bottoms === 2 && (
            <g fill={grey}><rect x="70" y="206" width="28" height="84" rx="9" /><rect x="102" y="206" width="28" height="84" rx="9" /></g>
          )}
          {seated && (
            <g fill={grey}><rect x="72" y="206" width="26" height="62" rx="9" /><rect x="102" y="206" width="26" height="62" rx="9" /></g>
          )}
          <ellipse cx="84" cy={seated ? 274 : 294} rx="15" ry="8" fill="#22232b" /><ellipse cx="116" cy={seated ? 274 : 294} rx="15" ry="8" fill="#22232b" />
          <rect x="50" y="146" width="20" height="66" rx="10" fill={jumperD} transform="rotate(10 60 150)" />
          <rect x="130" y="146" width="20" height="66" rx="10" fill={jumperD} transform="rotate(-10 140 150)" />
          <circle cx="49" cy="214" r="9" fill={skin} /><circle cx="151" cy="214" r="9" fill={skin} />
          <rect x="62" y="136" width="76" height="82" rx="24" fill={`url(#${id}j)`} />
          <rect x="62" y="206" width="76" height="12" rx="6" fill={jumperD} opacity=".55" />
        </g>
      )}
      {crop === 'head' && <rect x="56" y="136" width="88" height="60" rx="26" fill={`url(#${id}j)`} />}
      <rect x="90" y="124" width="20" height="20" rx="6" fill={skinD} />
      <path d="M86,138 l14,12 l14,-12 l-4,-4 h-20z" fill="#fff" />

      {/* head */}
      <circle cx="47" cy="88" r="10" fill={skinD} /><circle cx="153" cy="88" r="10" fill={skinD} />
      <ellipse cx="100" cy="82" rx="52" ry="54" fill={`url(#${id}s)`} />
      <circle cx="72" cy="104" r="10" fill="#ff7f8f" opacity=".28" /><circle cx="128" cy="104" r="10" fill="#ff7f8f" opacity=".28" />
      <path d="M97,96 q3,5 7,1" stroke={skinD} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {[80, 120].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="86" rx="10" ry="11.5" fill="#fff" />
          <circle cx={x + (x < 100 ? 1 : -1)} cy="87" r="7.2" fill="#6b4226" />
          <circle cx={x + (x < 100 ? 1 : -1)} cy="87" r="4" fill="#1b1410" />
          <circle cx={x + 3} cy="83.5" r="2.2" fill="#fff" />
          <path d={`M${x - 11},70 q11,-7 22,0`} stroke={hairD} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ))}
      {a.face === 0 && <path d="M84,108 q16,18 32,0z" fill="#8a2f3a" stroke="#8a2f3a" strokeWidth="2" strokeLinejoin="round" />}
      {a.face === 0 && <path d="M88,109 h24 v3 q-12,3 -24,0z" fill="#fff" />}
      {a.face === 1 && <path d="M86,108 q14,12 28,0" stroke="#8a2f3a" strokeWidth="3.5" fill="none" strokeLinecap="round" />}
      {a.face === 2 && <path d="M90,111 q10,4 20,0" stroke="#8a2f3a" strokeWidth="3.5" fill="none" strokeLinecap="round" />}
      {a.face === 3 && <path d="M86,108 q14,12 28,0" stroke="#8a2f3a" strokeWidth="3.5" fill="none" strokeLinecap="round" />}
      {a.face === 3 && (
        <g fill={shade(skin, -46)}>
          {[[66, 96], [72, 103], [64, 108], [73, 112], [134, 96], [128, 103], [136, 108], [127, 112]].map(([fx, fy]) => (
            <circle key={`${fx}-${fy}`} cx={fx} cy={fy} r="2.1" />
          ))}
        </g>
      )}
      {a.face === 4 && (
        <g transform="rotate(-9 100 108)">
          <path d="M83,105 q17,15 33,-1z" fill="#8a2f3a" />
          <path d="M86,105 h27 v3.4 q-13,3 -27,0z" fill="#fff" />
        </g>
      )}

      {/* hair in front of the head */}
      <g fill={`url(#${id}h)`}>
        {a.hairStyle === 0 && topCurls.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="15" />)}
        {(a.hairStyle === 1 || a.hairStyle === 5) && <path d={fringe} />}
        {(a.hairStyle === 2 || a.hairStyle === 3 || a.hairStyle === 4) && <path d={cap} />}
        {a.hairStyle === 2 && <path d="M70,34 l8,-18 l10,14 l10,-18 l10,16 l12,-14 l6,20z" />}
        {a.hairStyle === 3 && [0, 1, 2, 3].map((i) => (
          <g key={i}><ellipse cx="40" cy={98 + i * 17} rx="10" ry="11" /><ellipse cx="160" cy={98 + i * 17} rx="10" ry="11" /></g>
        ))}
      </g>
      {a.hairStyle === 3 && <><circle cx="40" cy="170" r="6" fill="#ff6fa8" /><circle cx="160" cy="170" r="6" fill="#ff6fa8" /></>}

      {/* head wear */}
      {a.headwear === 1 && (
        <g fill="rgba(255,255,255,.18)" stroke="#e0453a" strokeWidth="3.5">
          <circle cx="80" cy="87" r="15" /><circle cx="120" cy="87" r="15" /><path d="M95,85 q5,-4 10,0" fill="none" />
        </g>
      )}
      {a.headwear === 2 && (
        <g fill="rgba(255,255,255,.18)" stroke="#2f6fd0" strokeWidth="3.5">
          <rect x="63" y="74" width="33" height="26" rx="7" /><rect x="104" y="74" width="33" height="26" rx="7" /><path d="M96,85 h8" />
        </g>
      )}
      {a.headwear === 3 && (
        <g>
          <path d="M42,84 a58,62 0 0 1 116,0" stroke="#7a4fd0" strokeWidth="8" fill="none" strokeLinecap="round" />
          <rect x="31" y="70" width="19" height="36" rx="9" fill="#7a4fd0" /><rect x="150" y="70" width="19" height="36" rx="9" fill="#7a4fd0" />
          <rect x="35" y="78" width="6" height="20" rx="3" fill="#a98bea" /><rect x="159" y="78" width="6" height="20" rx="3" fill="#a98bea" />
        </g>
      )}
      {a.headwear === 4 && (
        <g>
          <path d="M156,76 q13,2 10,18 q-2,8 -9,9" stroke="#2f9be0" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="157" cy="103" r="4" fill="#f2c230" />
        </g>
      )}
      {a.headwear === 5 && (
        <g fill="#e2343c">
          <path d="M136,36 l-22,-13 v26z" /><path d="M136,36 l22,-13 v26z" /><circle cx="136" cy="36" r="7" fill="#b9222b" />
        </g>
      )}
    </svg>
  );
}
