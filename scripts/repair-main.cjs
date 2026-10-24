const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'main.jsx');
let source = fs.readFileSync(file, 'utf8');
const lines = source.split('\n');

const voiceLine = lines.findIndex(line => line.includes("{active==='voice'&&"));
const musicLine = lines.findIndex(line => line.includes("{active==='music'&&"));

if (voiceLine < 0 || musicLine < 0) {
  throw new Error(`Expected voice/music JSX sections not found (voice=${voiceLine + 1}, music=${musicLine + 1})`);
}

lines[voiceLine] = `  {active==='voice'&&<div className="single-workspace"><section className="panel"><div className="panel-heading"><div className="heading-icon coral"><Mic2 size={19}/></div><div><h2>Voice Lab</h2><p>अपनी recording को साफ़, संतुलित और गाने के लिए तैयार करें</p></div></div><div className="recording-tools"><b>मोबाइल से सीधे रिकॉर्ड करें</b><p>ब्राउज़र में microphone अनुमति दें। Recording लोकल रूप से बनेगी।</p>{recording?<button className="primary-button" onClick={stopRecording}>■ रिकॉर्डिंग रोकें</button>:<button className="outline-button" disabled={processing} onClick={startRecording}><Mic2 size={15}/> रिकॉर्डिंग शुरू करें</button>}{recordingUrl&&<audio controls src={recordingUrl} className="recorded-audio"/>}</div><div className="upload-zone" onClick={()=>{if(!processing)voiceInput.current?.click()}}><input ref={voiceInput} hidden type="file" accept="audio/*" disabled={processing} onChange={e=>{replaceProcessedUrl('');replaceRecordingUrl('');setVoiceFile(e.target.files?.[0]||null)}}/><div className="upload-icon"><Upload size={23}/></div><b>{voiceFile?voiceFile.name:'अपनी आवाज़ की recording अपलोड करें'}</b><p>WAV, MP3, M4A · बिना म्यूज़िक वाला sample बेहतर</p><button type="button" className="outline-button"><FileAudio size={15}/> ऑडियो चुनें</button></div><div className="two-fields"><div><label className="field-label">Voice tone</label><select className="text-input" value={tone} onChange={e=>setTone(e.target.value)}><option>Warm & intimate</option><option>Bright & clear</option><option>Soft & airy</option><option>Deep & cinematic</option><option>Powerful & expressive</option></select></div><div><label className="field-label">आवाज़ की clarity</label><select className="text-input"><option>Natural clean-up</option><option>Noise reduction</option><option>Studio polish</option></select></div></div><div className="notice"><Sparkles size={17}/><span><b>लोकल Basic Audio Cleanup</b><small>मुफ्त browser processing: 80 Hz low-rumble filter, gentle compressor और peak leveling। ऑडियो आपके डिवाइस पर process होता है। यह AI denoising या pitch correction नहीं है।</small></span></div><div className="button-row"><button className="primary-button" disabled={processing} onClick={cleanVoice}><WandSparkles size={16}/>{processing?'ऑडियो process हो रहा है…':'Basic cleanup चलाएं'}</button>{processing&&<button className="outline-button" onClick={cancelVoiceCleanup}>Cancel cleanup</button>}{processedUrl&&<button className="outline-button" onClick={downloadCleanVoice}><Download size={14}/> Clean WAV डाउनलोड</button>}</div>{processedUrl&&<div className="recording-tools"><b>Cleaned audio preview</b><audio controls src={processedUrl} className="recorded-audio"/></div>}</section></div>}`;
lines[musicLine] = `  {active==='music'&&<MusicDirector/>}`;

if (!source.includes("import MusicDirector from './MusicDirector.jsx';")) {
  lines.unshift("import MusicDirector from './MusicDirector.jsx';");
}

fs.writeFileSync(file, lines.join('\n'));
console.log(`Repaired ${path.relative(process.cwd(), file)} before Vite build.`);
