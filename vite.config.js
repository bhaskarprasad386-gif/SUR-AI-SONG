import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repairLegacyVoiceHandler = () => ({
  name: 'repair-legacy-voice-handler',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('/src/main.jsx')) return null;
    const broken = "onChange={e=>setFile(e,f=>{replaceProcessedUrl('');replaceRecordingUrl('');setVoiceFile(f)})}";
    const repaired = 'onChange={e=>setFile(e,setVoiceFile)}';
    if (!code.includes(broken)) return null;
    return { code: code.replace(broken, repaired), map: null };
  },
});

export default defineConfig({
  plugins: [repairLegacyVoiceHandler(), react()],
  base: process.env.GITHUB_ACTIONS ? '/SUR-AI-SONG/' : '/',
});
