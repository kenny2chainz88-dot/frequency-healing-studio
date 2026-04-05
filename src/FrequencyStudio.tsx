import { useState, useEffect, useRef, useCallback } from 'react';
import './studio.css';

const Icon = {
  Activity: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  Mic:      () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>),
  Stop:     () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>),
  Download: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  Pause:    () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>),
  Zap:      () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  Heart:    () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>),
  Brain:    () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-2.16A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-2.16A2.5 2.5 0 0 0 14.5 2Z"/></svg>),
  Waves:    () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>),
};

interface InstrumentDef { key: string; name: string; short: string; color: string; category: string; }
const INSTRUMENTS: InstrumentDef[] = [
  { key: '1', name: 'Pure Sine',    short: 'Sine',    color: '#6366f1', category: 'Electronic' },
  { key: '2', name: 'Violin',       short: 'Violin',  color: '#dc2626', category: 'Strings'    },
  { key: '3', name: 'Cello',        short: 'Cello',   color: '#9f1239', category: 'Strings'    },
  { key: '4', name: 'Trumpet',      short: 'Trumpet', color: '#d97706', category: 'Brass'      },
  { key: '5', name: 'French Horn',  short: 'F.Horn',  color: '#b45309', category: 'Brass'      },
  { key: '6', name: 'Flute',        short: 'Flute',   color: '#0891b2', category: 'Woodwind'   },
  { key: '7', name: 'Oboe',         short: 'Oboe',    color: '#15803d', category: 'Woodwind'   },
  { key: '8', name: 'Clarinet',     short: 'Clarinet',color: '#7c3aed', category: 'Woodwind'   },
  { key: '9', name: 'Church Organ', short: 'Organ',   color: '#a16207', category: 'Keyboard'   },
  { key: '0', name: 'Crystal Bell', short: 'Bell',    color: '#0369a1', category: 'Percussion' },
];

const SOLFEGGIO = [
  { hz: 174, label: 'Pain & Stress',    full: 'Relieve Pain & Stress',    key: 'A', color: '#6366f1' },
  { hz: 285, label: 'Tissue & Organs',  full: 'Heal Tissue & Organs',     key: 'S', color: '#14b8a6' },
  { hz: 396, label: 'Guilt & Fear',     full: 'Liberate Guilt & Fear',    key: 'D', color: '#f43f5e' },
  { hz: 417, label: 'Change',           full: 'Facilitate Change',         key: 'F', color: '#f59e0b' },
  { hz: 528, label: 'Miracles',         full: 'Transformation & Miracles', key: 'G', color: '#10b981' },
  { hz: 639, label: 'Relationships',    full: 'Connect Relationships',     key: 'H', color: '#3b82f6' },
  { hz: 741, label: 'Intuition',        full: 'Awaken Intuition',          key: 'J', color: '#8b5cf6' },
  { hz: 852, label: 'Spiritual',        full: 'Spiritual Order',           key: 'K', color: '#ec4899' },
  { hz: 963, label: 'Divine',           full: 'Divine Consciousness',      key: 'L', color: '#a78bfa' },
];
const ORGANS = [
  { organ: 'Blood',      hz: 321.9,  note: 'E',  key: 'Q' },
  { organ: 'Adrenals',   hz: 492.8,  note: 'B',  key: 'W' },
  { organ: 'Kidneys',    hz: 319.88, note: 'E',  key: 'E' },
  { organ: 'Liver',      hz: 317.83, note: 'E',  key: 'R' },
  { organ: 'Bladder',    hz: 352,    note: 'F',  key: 'T' },
  { organ: 'Intestines', hz: 281,    note: 'C',  key: 'Y' },
  { organ: 'Lungs',      hz: 220,    note: 'A',  key: 'U' },
  { organ: 'Brain',      hz: 315.8,  note: 'Eb', key: 'I' },
];
const COSMIC = [
  { label: 'Schumann',  hz: 7.83,   key: 'Z' },
  { label: 'Mercury',   hz: 141.27, key: 'X' },
  { label: 'Mars',      hz: 144.72, key: 'C' },
  { label: 'Saturn',    hz: 147.85, key: 'V' },
  { label: 'Jupiter',   hz: 183.58, key: 'B' },
  { label: 'Neptune',   hz: 211.44, key: 'N' },
  { label: 'Venus',     hz: 221.23, key: 'M' },
  { label: 'Healing A', hz: 432,    key: 'P' },
];
const BRAIN_WAVES = [
  { name: 'Gamma', range: '40–80 Hz', state: 'Superconscious', desc: 'High focus, perception.', hz: 60   },
  { name: 'Beta',  range: '13–39 Hz', state: 'Conscious',      desc: 'Alert, waking state.',   hz: 26   },
  { name: 'Alpha', range: '8–13 Hz',  state: 'Subconscious',   desc: 'Relaxed, meditative.',   hz: 10.5 },
  { name: 'Theta', range: '4–8 Hz',   state: 'Hypnagogic',     desc: 'Light sleep, shamanic.', hz: 6    },
  { name: 'Delta', range: '0.5–4 Hz', state: 'Deep Sleep',     desc: 'Deep unconscious.',      hz: 2.25 },
];

interface NoteVoice { mainGain: GainNode; allOscs: OscillatorNode[]; }

function createVoice(ctx: AudioContext, hzRaw: number, instrKey: string, dest: AudioNode): NoteVoice {
  const hz = hzRaw < 20 ? hzRaw * Math.pow(2, Math.ceil(Math.log2(40 / hzRaw))) : hzRaw;
  const now = ctx.currentTime;
  const mainGain = ctx.createGain();
  mainGain.connect(dest);
  const allOscs: OscillatorNode[] = [];
  const mkOsc = (type: OscillatorType, freq: number) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq; return o; };
  const mkFilt = (type: BiquadFilterType, freq: number, q = 1) => { const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = Math.max(40, Math.min(freq, 20000)); f.Q.value = q; return f; };
  const env = (g: GainNode, attack: number, peak = 1) => { g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(peak, now + attack); };
  const go = (...oscs: OscillatorNode[]) => oscs.forEach(o => { o.start(); allOscs.push(o); });

  switch (instrKey) {
    case '1': default: { env(mainGain, 0.08); const o = mkOsc('sine', hz); o.connect(mainGain); go(o); break; }
    case '2': {
      env(mainGain, 0.35, 0.85);
      const f = mkFilt('lowpass', Math.min(hz * 12, 9000), 0.6); f.connect(mainGain);
      const o1 = mkOsc('sawtooth', hz), o2 = mkOsc('sawtooth', hz * 1.003);
      const cg = ctx.createGain(); cg.gain.value = 0.4;
      o1.connect(f); o2.connect(cg); cg.connect(f);
      const vib = mkOsc('sine', 5.5), vg = ctx.createGain();
      vg.gain.setValueAtTime(0, now); vg.gain.linearRampToValueAtTime(hz * 0.007, now + 0.7);
      vib.connect(vg); vg.connect(o1.frequency); vg.connect(o2.frequency);
      go(o1, o2, vib); break;
    }
    case '3': {
      env(mainGain, 0.45, 0.85);
      const f = mkFilt('lowpass', Math.min(hz * 7, 5000), 0.6); f.connect(mainGain);
      const sg = ctx.createGain(); sg.gain.value = 0.3; sg.connect(mainGain);
      const o1 = mkOsc('sawtooth', hz), o2 = mkOsc('sawtooth', hz * 1.002), sub = mkOsc('sawtooth', hz * 0.5);
      o1.connect(f); o2.connect(f); sub.connect(sg);
      const vib = mkOsc('sine', 4.2), vg = ctx.createGain();
      vg.gain.setValueAtTime(0, now); vg.gain.linearRampToValueAtTime(hz * 0.005, now + 0.8);
      vib.connect(vg); vg.connect(o1.frequency); vg.connect(o2.frequency);
      go(o1, o2, sub, vib); break;
    }
    case '4': {
      env(mainGain, 0.12, 0.9);
      const hp = mkFilt('highpass', 80, 0.5), lp = mkFilt('lowpass', Math.min(hz * 22, 16000), 0.7);
      hp.connect(lp); lp.connect(mainGain);
      const o1 = mkOsc('sawtooth', hz), g2 = ctx.createGain(), o2 = mkOsc('sawtooth', hz * 2), g3 = ctx.createGain(), o3 = mkOsc('sawtooth', hz * 3);
      g2.gain.value = 0.3; g3.gain.value = 0.15;
      o1.connect(hp); o2.connect(g2); g2.connect(hp); o3.connect(g3); g3.connect(hp);
      go(o1, o2, o3); break;
    }
    case '5': {
      env(mainGain, 0.4, 0.8);
      const f = mkFilt('lowpass', Math.min(hz * 5, 3500), 0.9); f.connect(mainGain);
      const o1 = mkOsc('sawtooth', hz), g2 = ctx.createGain(), o2 = mkOsc('sine', hz * 2);
      g2.gain.value = 0.25; o1.connect(f); o2.connect(g2); g2.connect(f);
      const vib = mkOsc('sine', 4.8), vg = ctx.createGain();
      vg.gain.setValueAtTime(0, now); vg.gain.linearRampToValueAtTime(hz * 0.004, now + 0.7);
      vib.connect(vg); vg.connect(o1.frequency);
      go(o1, o2, vib); break;
    }
    case '6': {
      env(mainGain, 0.07, 0.75);
      const o1 = mkOsc('triangle', hz), g2 = ctx.createGain(), o2 = mkOsc('sine', hz * 2);
      g2.gain.value = 0.18; o1.connect(mainGain); o2.connect(g2); g2.connect(mainGain);
      const vib = mkOsc('sine', 5.5), vg = ctx.createGain(); vg.gain.value = hz * 0.005;
      vib.connect(vg); vg.connect(o1.frequency);
      go(o1, o2, vib); break;
    }
    case '7': {
      env(mainGain, 0.1, 0.8);
      const bp = mkFilt('bandpass', Math.min(hz * 3.5, 5000), 2.5); bp.connect(mainGain);
      const o1 = mkOsc('sawtooth', hz), g2 = ctx.createGain(), o2 = mkOsc('sawtooth', hz * 2), g3 = ctx.createGain(), o3 = mkOsc('sine', hz * 3);
      g2.gain.value = 0.5; g3.gain.value = 0.2;
      o1.connect(bp); o2.connect(g2); g2.connect(bp); o3.connect(g3); g3.connect(bp);
      go(o1, o2, o3); break;
    }
    case '8': {
      env(mainGain, 0.12, 0.8);
      const f = mkFilt('lowpass', Math.min(hz * 9, 7000), 0.8); f.connect(mainGain);
      const o1 = mkOsc('square', hz), g3 = ctx.createGain(), o3 = mkOsc('sine', hz * 3);
      g3.gain.value = 0.18; o1.connect(f); o3.connect(g3); g3.connect(f);
      go(o1, o3); break;
    }
    case '9': {
      mainGain.gain.setValueAtTime(0.85, now);
      [[1,0.8],[0.5,0.4],[2,0.6],[3,0.28],[4,0.35],[6,0.12],[8,0.08]].forEach(([m,g]) => {
        const gn = ctx.createGain(); gn.gain.value = g; const o = mkOsc('sine', hz * m);
        o.connect(gn); gn.connect(mainGain); o.start(); allOscs.push(o);
      }); break;
    }
    case '0': {
      mainGain.gain.setValueAtTime(1, now);
      [[1,1,3],[2.756,0.55,1.8],[5.404,0.25,1],[8.933,0.12,0.5]].forEach(([m,a,d]) => {
        const gn = ctx.createGain(); gn.gain.setValueAtTime(a, now); gn.gain.exponentialRampToValueAtTime(0.0001, now + d);
        const o = mkOsc('sine', hz * m); o.connect(gn); gn.connect(mainGain);
        o.start(); o.stop(now + d + 0.05); allOscs.push(o);
      }); break;
    }
  }
  return { mainGain, allOscs };
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function FrequencyHealingStudio() {
  const [activeNotes,    setActiveNotes]    = useState<Set<number>>(new Set());
  const [instrument,     setInstrument]     = useState(0);
  const [binauralActive, setBinauralActive] = useState(false);
  const [activeBW,       setActiveBW]       = useState<number | null>(null);
  const [carrierFreq,    setCarrierFreq]    = useState(200);
  const [targetBeat,     setTargetBeat]     = useState(10);
  const [volume,         setVolume]         = useState(0.12);
  const [swell,          setSwell]          = useState(0.7);
  const [autoSwell,      setAutoSwell]      = useState(false);
  const [waveType,       setWaveType]       = useState<OscillatorType>('sine');
  const [isPlaying,      setIsPlaying]      = useState(false);
  const [isRecording,    setIsRecording]    = useState(false);
  const [recordedBlob,   setRecordedBlob]   = useState<Blob | null>(null);

  const audioCtxRef   = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterRef     = useRef<BiquadFilterNode | null>(null);
  const voices        = useRef<Map<number, NoteVoice>>(new Map());
  const recorderRef   = useRef<MediaRecorder | null>(null);
  const chunksRef     = useRef<Blob[]>([]);
  const instrRef      = useRef(instrument);
  useEffect(() => { instrRef.current = instrument; }, [instrument]);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext;
      audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      masterGainRef.current = ctx.createGain();
      filterRef.current = ctx.createBiquadFilter();
      filterRef.current.type = 'lowpass'; filterRef.current.frequency.value = 18000; filterRef.current.Q.value = 1.2;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -20; comp.knee.value = 30; comp.ratio.value = 8; comp.attack.value = 0; comp.release.value = 0.2;
      masterGainRef.current.gain.value = volume * swell;
      masterGainRef.current.connect(filterRef.current); filterRef.current.connect(comp); comp.connect(ctx.destination);
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  }, [volume, swell]);

  const startNote = useCallback((hz: number) => {
    initAudio();
    if (!audioCtxRef.current || !masterGainRef.current || voices.current.has(hz)) return;
    voices.current.set(hz, createVoice(audioCtxRef.current, hz, INSTRUMENTS[instrRef.current].key, masterGainRef.current));
    setActiveNotes(p => new Set(p).add(hz)); setIsPlaying(true);
  }, [initAudio]);

  const stopNote = useCallback((hz: number) => {
    const voice = voices.current.get(hz);
    if (!voice || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    voice.mainGain.gain.cancelScheduledValues(ctx.currentTime);
    voice.mainGain.gain.setValueAtTime(voice.mainGain.gain.value, ctx.currentTime);
    voice.mainGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    setTimeout(() => { voice.allOscs.forEach(o => { try { o.stop(); o.disconnect(); } catch { /* expected during cleanup */ } }); try { voice.mainGain.disconnect(); } catch { /* expected */ } }, 350);
    voices.current.delete(hz);
    setActiveNotes(p => { const n = new Set(p); n.delete(hz); if (!n.size) setIsPlaying(false); return n; });
  }, []);

  const stopAll = useCallback(() => {
    const all = [...voices.current.entries()]; voices.current.clear();
    all.forEach(([, v]) => {
      if (audioCtxRef.current) try { v.mainGain.gain.setValueAtTime(0, audioCtxRef.current.currentTime); } catch { /* expected */ }
      setTimeout(() => { v.allOscs.forEach(o => { try { o.stop(); o.disconnect(); } catch { /* expected during cleanup */ } }); try { v.mainGain.disconnect(); } catch { /* expected */ } }, 50);
    });
    setActiveNotes(new Set()); setBinauralActive(false); setActiveBW(null); setIsPlaying(false);
  }, []);

  const playBinaural = useCallback((carrier: number, beat: number, bwIdx: number | null = null) => {
    initAudio(); stopAll();
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const mkSide = (freq: number, pan: number): NoteVoice => {
      const gain = ctx.createGain(), panner = ctx.createStereoPanner(), osc = ctx.createOscillator();
      osc.type = 'sine'; osc.frequency.value = freq; panner.pan.value = pan;
      gain.gain.setValueAtTime(0, ctx.currentTime); gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.25);
      osc.connect(gain); gain.connect(panner); panner.connect(masterGainRef.current!); osc.start();
      return { mainGain: gain, allOscs: [osc] };
    };
    voices.current.set(-1, mkSide(carrier, -1));
    voices.current.set(-2, mkSide(carrier + beat, 1));
    setBinauralActive(true); setActiveBW(bwIdx); setIsPlaying(true);
  }, [initAudio, stopAll]);

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey) return;
      const instrIdx = INSTRUMENTS.findIndex(i => i.key === e.key);
      if (instrIdx >= 0) { setInstrument(instrIdx); return; }
      const k = e.key.toUpperCase();
      const hz = SOLFEGGIO.find(f => f.key === k)?.hz ?? ORGANS.find(f => f.key === k)?.hz ?? COSMIC.find(f => f.key === k)?.hz;
      if (hz !== undefined) startNote(hz);
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      const hz = SOLFEGGIO.find(f => f.key === k)?.hz ?? ORGANS.find(f => f.key === k)?.hz ?? COSMIC.find(f => f.key === k)?.hz;
      if (hz !== undefined) stopNote(hz);
    };
    window.addEventListener('keydown', dn); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, [startNote, stopNote]);

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current)
      masterGainRef.current.gain.setTargetAtTime(volume * swell, audioCtxRef.current.currentTime, 0.08);
  }, [swell, volume]);

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    if (autoSwell) { let a = 0; id = setInterval(() => { a += 0.04; setSwell(0.25 + ((Math.sin(a)+1)/2)*0.75); }, 50); }
    return () => { if (id) clearInterval(id); };
  }, [autoSwell]);

  useEffect(() => () => { audioCtxRef.current?.close(); }, []);

  const startRecording = () => {
    initAudio();
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const dest = audioCtxRef.current.createMediaStreamDestination();
    masterGainRef.current.connect(dest);
    const rec = new MediaRecorder(dest.stream);
    chunksRef.current = [];
    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => setRecordedBlob(new Blob(chunksRef.current, { type: 'audio/webm' }));
    rec.start(); recorderRef.current = rec; setIsRecording(true); setRecordedBlob(null);
  };
  const stopRecording = () => { recorderRef.current?.stop(); setIsRecording(false); };
  const download = (ext: string) => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a'); a.href = url; a.download = `healing.${ext}`; a.click(); URL.revokeObjectURL(url);
  };

  const instr = INSTRUMENTS[instrument];
  const statusText = binauralActive ? `Binaural · ${targetBeat}Hz` : activeNotes.size ? (activeNotes.size === 1 ? `${[...activeNotes][0]}Hz` : `${activeNotes.size} freqs`) : 'Silence';

  /* ── helpers for key events ── */
  const press = (hz: number) => () => startNote(hz);
  const rel   = (hz: number) => () => stopNote(hz);

  return (
    <div className="studio-root">

      {/* ── HEADER ── */}
      <header className="studio-header">
        <div className="header-left">
          <div className="title-stack">
            <h1 className="studio-title">Vibrational Studio</h1>
            <span className="author-tag">by kenny</span>
          </div>
          <span className="studio-subtitle">
            <strong>A–L</strong> Solfeggio &nbsp;·&nbsp; <strong>Q–I</strong> Organs &nbsp;·&nbsp; <strong>Z–P</strong> Cosmic &nbsp;·&nbsp; <strong>1–0</strong> Instrument
          </span>
        </div>
        <div className="header-controls">
          {!isRecording
            ? <button className="btn btn-danger" onClick={startRecording}><Icon.Mic /> Record</button>
            : <button className="btn btn-stop"   onClick={stopRecording}><Icon.Stop /> Stop</button>}
          {recordedBlob && <>
            <button className="btn btn-download" onClick={() => download('wav')}><Icon.Download /> WAV</button>
            <button className="btn btn-download" onClick={() => download('mp3')}><Icon.Download /> MP3</button>
          </>}
        </div>
      </header>

      {/* ── INSTRUMENT SELECTOR ── */}
      <div className="instrument-bar">
        {INSTRUMENTS.map((ins, idx) => (
          <button key={ins.key} className={`instr-btn${instrument === idx ? ' active' : ''}`}
            style={instrument === idx ? { background: ins.color, boxShadow: `0 3px 16px ${ins.color}55` } : {}}
            onClick={() => setInstrument(idx)}>
            <span className="instr-key">{ins.key}</span>
            <span className="instr-name">{ins.short}</span>
            <span className="instr-cat">{ins.category}</span>
          </button>
        ))}
      </div>

      {/* ── CONTROLS STRIP ── */}
      <div className="controls-strip">
        <div className={`status-orb${isPlaying ? ' active' : ''}`}>
          {isPlaying ? <Icon.Activity /> : <Icon.Pause />}
        </div>
        <div className="status-info">
          <div className="status-label">Now Playing</div>
          <div className="status-value">{statusText}</div>
          {isPlaying && <div className="status-instr" style={{ color: instr.color }}>{instr.name}</div>}
        </div>

        <div className="ctrl-divider" />

        <div className="ctrl-group">
          <span className="ctrl-label">Vol</span>
          <input type="range" min="0" max="0.3" step="0.005" value={volume} title="Volume"
            onChange={e => setVolume(+e.target.value)} />
          <span className="ctrl-val">{Math.round(volume*333)}%</span>
        </div>

        <div className="ctrl-group">
          <span className="ctrl-label">Swell</span>
          <input type="range" min="0" max="1" step="0.01" value={swell} className="amber" title="Swell"
            onChange={e => { setAutoSwell(false); setSwell(+e.target.value); }} />
          <button className="auto-btn" onClick={() => setAutoSwell(v => !v)}
            style={{ borderColor: autoSwell ? '#6366f1' : 'rgba(99,102,241,0.2)', background: autoSwell ? 'rgba(99,102,241,0.2)' : 'transparent', color: autoSwell ? '#818cf8' : '#475569' }}>
            Auto
          </button>
        </div>

        <div className="ctrl-divider" />

        <select className="timbre-select" value={waveType} onChange={e => setWaveType(e.target.value as OscillatorType)} title="Timbre">
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="square">Square</option>
        </select>

        <button className="btn-silence" onClick={stopAll}>⬛ Stop All</button>
      </div>

      {/* ── PIANO ── */}
      <div className="piano-wrap">

        {/* Solfeggio — home row A–L */}
        <div className="piano-section">
          <div className="piano-label">Solfeggio Frequencies · A–L</div>
          <div className="piano-row">
            {SOLFEGGIO.map(f => {
              const on = activeNotes.has(f.hz);
              return (
                <div key={f.hz} className="key-slot">
                  <button className={`key key-sol${on ? ' pressed' : ''}`}
                    style={on ? { background: `linear-gradient(180deg,${f.color},${f.color}99)` } : {}}
                    onMouseDown={press(f.hz)} onMouseUp={rel(f.hz)} onMouseLeave={rel(f.hz)}
                    onTouchStart={e => { e.preventDefault(); startNote(f.hz); }} onTouchEnd={rel(f.hz)}>
                    {f.key}
                  </button>
                  <div className="key-meta">
                    <div className="key-meta-hz" style={{ color: on ? f.color : undefined }}>{f.hz} Hz</div>
                    <div className="key-meta-label">{f.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organs — top row Q–I */}
        <div className="piano-section">
          <div className="piano-label">Organ Resonance · Q–I</div>
          <div className="piano-row">
            {ORGANS.map(f => {
              const on = activeNotes.has(f.hz);
              return (
                <div key={f.organ} className="key-slot">
                  <button className={`key key-org${on ? ' pressed' : ''}`}
                    onMouseDown={press(f.hz)} onMouseUp={rel(f.hz)} onMouseLeave={rel(f.hz)}
                    onTouchStart={e => { e.preventDefault(); startNote(f.hz); }} onTouchEnd={rel(f.hz)}>
                    {f.key}
                  </button>
                  <div className="key-meta">
                    <div className="key-meta-hz teal">{f.hz}</div>
                    <div className="key-meta-label teal">{f.organ}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cosmic — bottom row Z–P */}
        <div className="piano-section">
          <div className="piano-label">Celestial · Z–P</div>
          <div className="piano-row">
            {COSMIC.map(f => {
              const on = activeNotes.has(f.hz);
              return (
                <div key={f.label} className="key-slot">
                  <button className={`key key-cos${on ? ' pressed' : ''}`}
                    onMouseDown={press(f.hz)} onMouseUp={rel(f.hz)} onMouseLeave={rel(f.hz)}
                    onTouchStart={e => { e.preventDefault(); startNote(f.hz); }} onTouchEnd={rel(f.hz)}>
                    {f.key}
                  </button>
                  <div className="key-meta">
                    <div className="key-meta-hz violet">{f.hz}</div>
                    <div className="key-meta-label violet">{f.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BOTTOM 3-COLUMN PANEL ── */}
      <div className="bottom-panel">

        {/* Col 1: Solfeggio list */}
        <div className="panel-col">
          <div className="section-header">
            <div className="section-icon indigo"><Icon.Zap /></div>
            <h2 className="section-title">Solfeggio Scale</h2>
          </div>
          <div className="freq-list">
            {SOLFEGGIO.map(f => (
              <button key={f.hz} className={`freq-item${activeNotes.has(f.hz) ? ' active' : ''}`}
                onClick={() => activeNotes.has(f.hz) ? stopNote(f.hz) : startNote(f.hz)}>
                <div className="freq-dot" style={{ background: f.color }} />
                <div className="freq-name">{f.full}</div>
                <span className="freq-key">[{f.key}]</span>
                <div className="freq-hz-badge">{f.hz} Hz</div>
              </button>
            ))}
          </div>
        </div>

        {/* Col 2: Organ table */}
        <div className="panel-col">
          <div className="section-header">
            <div className="section-icon teal"><Icon.Heart /></div>
            <h2 className="section-title">Organ Resonance</h2>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', flexShrink: 0 }}>
            <table className="organ-table">
              <thead><tr><th>Organ</th><th>Frequency</th><th>Note</th></tr></thead>
              <tbody>
                {ORGANS.map(f => (
                  <tr key={f.organ} className={activeNotes.has(f.hz) ? 'active' : ''}
                    onClick={() => activeNotes.has(f.hz) ? stopNote(f.hz) : startNote(f.hz)}>
                    <td>{f.organ} <span style={{ color:'var(--text-muted)', fontSize:10, fontFamily:'monospace' }}>[{f.key}]</span></td>
                    <td>{f.hz} Hz</td>
                    <td>{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Brain waves as compact chips */}
          <div className="section-header" style={{ marginTop: 4 }}>
            <div className="section-icon indigo"><Icon.Brain /></div>
            <h2 className="section-title">Brain States</h2>
          </div>
          <div className="bw-chips">
            {BRAIN_WAVES.map((w, i) => (
              <button key={w.name} className={`bw-chip${activeBW === i ? ' active' : ''}`}
                onClick={() => { setTargetBeat(w.hz); playBinaural(carrierFreq, w.hz, i); }}>
                <span className="bw-chip-name">{w.name}</span>
                <span className="bw-chip-hz">{w.range}</span>
                <span className="bw-chip-state">{w.state}</span>
                <span className="bw-chip-desc">{w.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Col 3: Binaural generator */}
        <div className="panel-col binaural-col">
          <div className="section-header">
            <div className="section-icon teal"><Icon.Waves /></div>
            <h2 className="section-title">Binaural Generator</h2>
          </div>
          <div className="card card-teal binaural-controls">
            <div className="slider-row">
              <span className="ctrl-label" style={{ width: 60 }}>Carrier</span>
              <input type="range" min="80" max="600" step="1" value={carrierFreq}
                onChange={e => setCarrierFreq(+e.target.value)} title="Carrier Frequency" />
              <span className="ctrl-val">{carrierFreq} Hz</span>
            </div>
            <div className="slider-row">
              <span className="ctrl-label" style={{ width: 60 }}>Beat</span>
              <input type="range" min="0.5" max="80" step="0.5" value={targetBeat} className="teal"
                onChange={e => setTargetBeat(+e.target.value)} title="Beat Frequency" />
              <span className="ctrl-val" style={{ color: '#5eead4' }}>{targetBeat} Hz</span>
            </div>
            <button className="btn btn-primary" onClick={() => playBinaural(carrierFreq, targetBeat, null)}>
              Generate Binaural Beat
            </button>
            <div className="bw-note">
              <div className="bw-note-label">How it works</div>
              Left ear hears the carrier; right ear hears carrier + beat frequency.
              The brain perceives the difference as a rhythmic pulse and entrains to it.
              <div className="bw-warning">⚠ Stereo headphones required</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
