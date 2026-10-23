import React, { useEffect, useRef, useState } from 'react';
import { AudioWaveform, Check, Download, Layers3, Music2, ScanSearch, Sparkles, Upload } from 'lucide-react';

const DEFAULT_LAYERS=[
 {name:'Acoustic guitar',kind:'Instrument',on:true},
 {name:'Soft piano',kind:'Instrument',on:true},
 {name:'Strings & pads',kind:'Atmosphere',on:false},
 {name:'Bass',kind:'Instrument',on:true},
 {name:'Percussion',kind:'Rhythm',on:true},
];
const moods=['Romantic Bollywood','Acoustic ballad','Indie pop','Cinematic orchestral','Folk fusion','Devotional'];

function audioBufferToWav(buffer){
 const channels=Math.min(2,buffer.numberOfChannels),frames=buffer.length,rate=buffer.sampleRate,bytes=44+frames*channels*2;
 const view=new DataView(new ArrayBuffer(bytes));
 const write=(o,s)=>{for(let i=0;i<s.length;i++)view.setUint8(o+i,s.charCodeAt(i))};
 write(0,'RIFF');view.setUint32(4,bytes-8,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,rate,true);view.setUint32(28,rate*channels*2,true);view.setUint16(32,channels*2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,bytes-44,true);
 const data=Array.from({length:channels},(_,ch)=>buffer.getChannelData(ch));let peak=0;
 for(let ch=0;ch<channels;ch++)for(let i=0;i<frames;i++)peak=Math.max(peak,Math.abs(data[ch][i]||0));
 const gain=peak>0?Math.min(2,.92/peak):1;let o=44;
 for(let i=0;i<frames;i++)for(let ch=0;ch<channels;ch++){const s=Math.max(-1,Math.min(1,(data[ch][i]||0)*gain));view.setInt16(o,s<0?s*32768:s*32767,true);o+=2;}
 return new Blob([view],{type:'audio/wav'});
}

export default function MusicDirector(){
 const [tempo,setTempo]=useState(92),[mood,setMood]=useState('Romantic Bollywood'),[layers,setLayers]=useState(DEFAULT_LAYERS),[previewUrl,setPreviewUrl]=useState(''),[busy,setBusy]=useState(false),[refFile,setRefFile]=useState(null),[analysis,setAnalysis]=useState(null),[analysisBusy,setAnalysisBusy]=useState(false),[error,setError]=useState('');
 const urlRef=useRef('');
 useEffect(()=>()=>{if(urlRef.current)URL.revokeObjectURL(urlRef.current)},[]);
 const toggle=i=>setLayers(a=>a.map((x,j)=>j===i?{...x,on:!x.on}:x));
 const analyze=async file=>{
  setRefFile(file);setAnalysis(null);setError('');if(!file)return;setAnalysisBusy(true);
  try{
   const C=window.AudioContext||window.webkitAudioContext;if(!C)throw new Error('Browser audio analysis उपलब्ध नहीं है।');
   const ctx=new C();const raw=await file.arrayBuffer();const buffer=await ctx.decodeAudioData(raw);await ctx.close().catch(()=>{});
   const channels=buffer.numberOfChannels,duration=buffer.duration,sampleRate=buffer.sampleRate,frames=buffer.length;
   let sum=0,peak=0,cross=0,count=0;
   for(let ch=0;ch<channels;ch++){const d=buffer.getChannelData(ch);let prev=d[0]||0;const step=Math.max(1,Math.floor(frames/200000));for(let i=0;i<frames;i+=step){const s=d[i]||0;sum+=s*s;peak=Math.max(peak,Math.abs(s));if(i>0&&((s>=0)!==(prev>=0)))cross++;prev=s;count++;}}
   const rms=Math.sqrt(sum/Math.max(1,count)),approxBpm=Math.max(55,Math.min(180,Math.round((cross/Math.max(1,count))*sampleRate*60/2)));
   setAnalysis({duration,sampleRate,channels,peak,rms,approxBpm});
  }catch(e){setError(e?.message||'Reference audio decode नहीं हुआ। WAV/MP3/M4A file आज़माएं।')}finally{setAnalysisBusy(false)}
 };
 const makePreview=async()=>{
  const active=layers.filter(x=>x.on);if(!active.length){setError('कम-से-कम एक layer चालू करें।');return}setBusy(true);setError('');
  try{
   const bpm=Math.max(55,Math.min(160,tempo)),sr=22050,beats=64,duration=beats*60/bpm;const ctx=new OfflineAudioContext(2,Math.ceil(duration*sr),sr);
   const add=(freq,start,len,vol,type='sine')=>{const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type=type;o.frequency.value=freq;f.type='lowpass';f.frequency.value=type==='triangle'?1800:1300;g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),start+.02);g.gain.setValueAtTime(Math.max(.0002,vol),Math.max(start+.03,start+len-.08));g.gain.exponentialRampToValueAtTime(.0001,start+len);o.connect(f);f.connect(g);g.connect(ctx.destination);o.start(start);o.stop(start+len+.01)};
   const has=n=>active.some(x=>x.name===n),chords=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
   for(let beat=0;beat<beats;beat+=4){const start=beat*60/bpm,len=4*60/bpm,ch=chords[(beat/4)%chords.length];if(has('Soft piano'))ch.forEach(f=>add(f,start,len,.045,'sine'));if(has('Acoustic guitar'))for(let n=0;n<8;n++)add(ch[n%3]*2,start+n*len/8,len/10,.022,'triangle');if(has('Strings & pads'))ch.forEach(f=>add(f/2,start,len,.025,'sine'));if(has('Bass'))add(ch[0]/2,start,len,.065,'sine');}
   if(has('Percussion'))for(let beat=0;beat<beats;beat++){const s=beat*60/bpm;add(beat%4===0?110:beat%2===0?82:65,s,.075,beat%4===0?.07:.035,'sine');if(beat%2===0)add(1200,s,.025,.016,'triangle')}
   const url=URL.createObjectURL(audioBufferToWav(await ctx.startRendering()));if(urlRef.current)URL.revokeObjectURL(urlRef.current);urlRef.current=url;setPreviewUrl(url);
  }catch(e){setError(e?.message||'Preview नहीं बन सका।')}finally{setBusy(false)}
 };
 return <div className="single-workspace"><section className="panel"><div className="panel-heading"><div className="heading-icon purple"><Music2 size={19}/></div><div><h2>Music Director</h2><p>मूड, tempo, layers और reference audio को एक जगह नियंत्रित करें</p></div></div>
 <div className="reference-card"><div className="ref-icon"><ScanSearch size={22}/></div><div className="ref-copy"><b>Reference song technical analysis</b><p>Browser में audio decode करके duration, sample rate, channels, peak/RMS और approximate BPM निकाला जाएगा। यह style/instrument recognition नहीं है।</p>{refFile&&<small className="file-picked"><Check size={13}/>{refFile.name}</small>}</div><input hidden id="music-reference-input" type="file" accept="audio/*" onChange={e=>analyze(e.target.files?.[0])}/><button className="outline-button" onClick={()=>document.getElementById('music-reference-input')?.click()}><Upload size={15}/> Reference चुनें</button></div>
 {analysisBusy&&<div className="notice"><Sparkles size={17}/><span><b>Reference analyze हो रहा है…</b><small>Local browser decoding चल रही है; audio कहीं upload नहीं हो रहा।</small></span></div>}
 {analysis&&<div className="media-list"><div className="media-item"><AudioWaveform size={16}/><span>{analysis.duration.toFixed(1)} sec · {analysis.sampleRate} Hz · {analysis.channels} ch</span><small>Peak {analysis.peak.toFixed(3)} · RMS {analysis.rms.toFixed(3)} · ~{analysis.approxBpm} BPM</small></div></div>}
 <div className="two-fields"><div><label className="field-label">Target mood</label><select className="text-input" value={mood} onChange={e=>setMood(e.target.value)}>{moods.map(m=><option key={m}>{m}</option>)}</select></div><div><label className="field-label">Tempo · {tempo} BPM</label><input type="range" min="55" max="160" value={tempo} onChange={e=>setTempo(+e.target.value)} className="range"/></div></div>
 <label className="field-label">Multi-track arrangement</label><div className="track-list">{layers.map((l,i)=><div className="track-row" key={l.name}><div className="track-symbol"><AudioWaveform size={16}/></div><div className="track-label"><b>{l.name}</b><small>{l.kind}</small></div><div className={'fake-wave '+(!l.on?'wave-muted':'')}>{Array.from({length:30},(_,j)=><i key={j} style={{height:(7+((j*17+i*13)%24))+'px'}}/>)}</div><button className={'toggle '+(l.on?'toggle-on':'')} onClick={()=>toggle(i)} aria-label={'toggle '+l.name}><span/></button></div>)}</div>
 <div className="notice"><Layers3 size={17}/><span><b>Local arrangement sketch · {mood}</b><small>64-beat browser synthesis. Mood अभी visual/metadata selection है; generated sound is a simple synthesized sketch, not AI-generated instruments, singing, or real stems.</small></span></div>
 {error&&<div className="notice"><span><b>⚠ {error}</b></span></div>}
 <button className="primary-button" disabled={busy} onClick={makePreview}><Sparkles size={16}/>{busy?'Preview बन रहा है…':'Local audio preview बनाएं'}</button>
 {previewUrl&&<div className="recording-tools music-preview-tools"><b>Arrangement sketch · {tempo} BPM</b><audio controls src={previewUrl} className="recorded-audio"/><button className="outline-button" onClick={()=>{const a=document.createElement('a');a.href=previewUrl;a.download='sur-arrangement-sketch.wav';a.click()}}><Download size={14}/> WAV डाउनलोड</button></div>}
 </section></div>;
}
