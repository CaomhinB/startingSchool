'use client';
import { useState } from 'react';
import AvatarSvg from './Avatar';
import { Avatar, BOTTOMS, ChoiceKey, cleanName, FACES, HAIR, HAIR_STYLES, HEADWEAR, JUMPER, setChoice, SKIN, STEPS } from '@/lib/avatar';

export default function Maker({ avatar, onChange, onDone }: { avatar: Avatar; onChange: (a: Avatar) => void; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const last = step === STEPS.length - 1;
  const swatches = s.key === 'skin' ? SKIN : s.key === 'hairColour' ? HAIR : s.key === 'jumper' ? JUMPER : null;
  const names = s.key === 'hairStyle' ? HAIR_STYLES : s.key === 'face' ? FACES : s.key === 'headwear' ? HEADWEAR : s.key === 'bottoms' ? BOTTOMS : null;

  return (
    <div className="maker">
      <h1>MAKE YOUR CHARACTER</h1>
      <div className={`maker-avatar ${s.zoom ? 'zoom' : ''}`}>
        <AvatarSvg a={avatar} crop={s.zoom ? 'head' : 'full'} />
      </div>
      <div className="panel">
        <h2>{s.title}</h2>
        {s.key !== 'name' && (
          <div className="grid">
            {Array.from({ length: s.count }, (_, i) => {
              const key = s.key as ChoiceKey;
              const on = avatar[key] === i;
              return (
                <button key={i} className={`opt ${on ? 'on' : ''}`} aria-pressed={on} aria-label={swatches ? `${s.title} ${i + 1}` : names![i]}
                  style={swatches ? { background: swatches[i] } : undefined} onClick={() => onChange(setChoice(avatar, key, i))}>
                  {!swatches && (key === 'headwear' && i === 0
                    ? <span className="none">None</span>
                    : <AvatarSvg a={setChoice(avatar, key, i)} crop={key === 'bottoms' ? 'full' : 'head'} />)}
                </button>
              );
            })}
          </div>
        )}
        {s.key === 'name' && (
          <div className="namebox">
            <label htmlFor="nm">Type your first name</label>
            <input id="nm" value={avatar.name} maxLength={12} autoComplete="off" placeholder="Your name"
              onChange={(e) => onChange({ ...avatar, name: cleanName(e.target.value) })} />
            <small>Your name stays on this device. It is never sent anywhere.</small>
          </div>
        )}
        <div className="dots">{STEPS.map((_, i) => <i key={i} className={i === step ? 'on' : ''} />)}</div>
        <div className="nav">
          {step > 0 && <button className="go small" aria-label="Back" onClick={() => setStep(step - 1)}>‹</button>}
          <button className="go small" aria-label={last ? 'Finished' : 'Next'} onClick={() => (last ? onDone() : setStep(step + 1))}>{last ? '✓' : '›'}</button>
        </div>
      </div>
    </div>
  );
}
