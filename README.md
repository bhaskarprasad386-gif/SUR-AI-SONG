# Sur AI Studio — Free Personal Edition

A Hindi-first, local-first creative studio for songwriting, voice improvement, music arrangement and music video creation.

## Free-first promise

Sur AI Studio is intended for personal use without a required subscription or mandatory paid API. Prefer local/offline tools and open-source models wherever practical. Do not silently send users to paid providers, enable paid APIs, or incur usage charges without explicit opt-in.

**Honest limitations:** Free/open-source does not mean effortless or unlimited cloud compute. Local AI may need a capable computer, disk space, model downloads and setup time. Optional cloud services must be clearly labelled with quotas/costs and must remain disabled unless the user deliberately enables them.

## User workflow

1. Write original lyrics from a story, emotion, language and mood.
2. Record or import the user's own voice; clean noise, improve clarity and tune pitch.
3. Analyze a reference track for high-level attributes such as tempo, mood, instrumentation and arrangement, then create an original composition.
4. Build multi-voice arrangements (lead, doubles, harmonies, backing vocals) and multi-instrument stems, then mix and export audio.
5. Add photos/video clips, timed lyrics, transitions and effects; render a music video.
6. Save and reopen personal projects locally.

Reference audio is a guide to broad musical attributes. Do not copy a reference recording's exact melody or imitate a real singer's identity without consent.

## Free/local technology direction

- **Frontend:** React + Vite.
- **Audio/video processing:** FFmpeg for supported media operations; browser APIs for recording and preview; open-source audio utilities where appropriate.
- **Speech/voice:** evaluate locally runnable open-source noise reduction, pitch correction and voice-processing tools. Any voice model should only process a voice the user owns or is authorized to use.
- **Lyrics and music generation:** make provider adapters modular; prefer local/open-weight models when their licences and hardware requirements permit. Never claim a feature works until a real model is integrated and tested.
- **Storage:** local project files by default; no cloud upload unless explicitly requested.
- **Secrets and costs:** no API keys in frontend code or Git. Optional paid services require explicit opt-in and a clear cost notice.

## Current build status

The React/Vite interface includes an editable lyrics workspace with a sample lyric draft, TXT lyrics export, audio upload, in-browser microphone recording and preview, a basic local browser audio cleanup pass (80 Hz high-pass filter, gentle compression and peak leveling) with WAV export, reference-track selection, editable multi-track controls, photo/video selection, and project metadata save/load in the current browser via localStorage. These are UI/local-browser features, not a complete AI music pipeline. Lyrics are a sample template, not AI-generated. Advanced AI voice enhancement/noise removal and pitch correction, reference analysis, music generation, final video rendering, and durable media bundling are not integrated. The basic cleanup runs in the browser without uploading audio; it is not AI denoising and cannot remove all background noise. Saved project metadata does not embed uploaded audio or video files, and browser storage may be cleared by the user or device.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Implementation order

1. Add robust project export/import, including clear handling of media files.
2. Improve offline recording/import and preview; the first basic local cleanup + WAV export is implemented, and needs device/browser testing.
3. Add a configurable local model adapter for lyrics, with an honest fallback if no model is installed.
4. Integrate locally runnable voice enhancement and pitch tools; clearly label any hardware/model requirements.
5. Add original music generation/stem mixing through an open-source local engine where feasible.
6. Add a local video timeline and FFmpeg export.
7. Test each end-to-end feature before marking it complete.

No paid service is mandatory in the intended personal-use workflow. No feature should be labelled AI-powered until its actual model/backend is connected.
