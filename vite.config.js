import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repairLegacyAppSource = () => ({
  name: 'repair-legacy-app-source',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('/src/main.jsx')) return null;
    const lines = code.split('\n');
    const voiceNeedle = "onChange={e=>setFile(e,f=>{replaceProcessedUrl('');replaceRecordingUrl('');setVoiceFile(f)})}";
    const voiceReplacement = 'onChange={e=>setFile(e,setVoiceFile)}';
    if (lines[211]?.includes("active==='voice'")) {
      lines[211] = lines[211].replace(voiceNeedle, voiceReplacement);
    }
    if (!lines[212]?.includes("active==='music'")) return null;
    lines[212] = "  {active==='music'&&<MusicDirector/>}";
    return { code: "import MusicDirector from './MusicDirector.jsx';\n" + lines.join('\n'), map: null };
  },
});

export default defineConfig({
  plugins: [repairLegacyAppSource(), react()],
  base: process.env.GITHUB_ACTIONS ? '/SUR-AI-SONG/' : '/',
});
