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

The initial React/Vite interface includes a lyrics draft workspace, audio file selection, reference-track selection, editable multi-track layer controls and photo/video selection. Lyrics are currently a demo template, not connected AI generation. Voice processing, reference analysis, music generation, persistence and final video rendering are not yet integrated.

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

1. Keep the frontend buildable and add local project save/load.
2. Implement offline recording/import, preview, and non-destructive audio cleanup tools.
3. Add a configurable local model adapter for lyrics, with an honest fallback if no model is installed.
4. Integrate locally runnable voice enhancement and pitch tools; clearly label any hardware/model requirements.
5. Add original music generation/stem mixing through an open-source local engine where feasible.
6. Add a local video timeline and FFmpeg export.
7. Test each end-to-end feature before marking it complete.

No paid service is mandatory in the intended personal-use workflow. No feature should be labelled AI-powered until its actual model/backend is connected.
