# My Maths Tutor – Version 1

Installable PWA for a CBSE Class 7 student following **NCERT Ganita Prakash (2026–27)**.

## Included
- 15 current Ganita Prakash chapters
- Learn mode with concise concept notes
- Unlimited generated practice questions
- Answer checking with hints and explanations
- Mixed, chapter and weak-area tests
- Progress, streak and chapter mastery tracking
- Parent dashboard protected by a PIN
- Voice input using browser SpeechRecognition where supported
- Spoken tutor replies using browser speech synthesis
- Offline practice/test support after first load
- Optional cloud AI tutor through a secure Netlify Function

## Run locally
PWA/service-worker features need HTTP rather than opening `index.html` directly.

With Python installed:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080` in Chrome or Edge.

## Deploy to Netlify
1. Put this folder in a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Select the repository. No build command is needed; publish directory is `.`.
4. Deploy.
5. Open the deployed site in Chrome/Edge and use **Install App** when offered.

## Enable the natural-language AI tutor
The app works without an API key using a small offline tutoring fallback. For genuinely flexible natural-language teaching, configure the server-side function:

1. Create an OpenAI API key in your OpenAI API account.
2. In Netlify: **Site configuration → Environment variables**.
3. Add `OPENAI_API_KEY` with the key value.
4. Optional: add `OPENAI_MODEL`. Default in this package is `gpt-5.6-luna` for a cost-sensitive tutor.
5. Redeploy the site.

**Never place the OpenAI API key in `app.js` or any browser-side file.**

## Privacy notes
- Student progress is stored locally in the browser (`localStorage`) in Version 1.
- When cloud tutor mode is enabled, chat messages and a small recent performance summary are sent to the configured OpenAI API endpoint through the Netlify server function.
- Version 1 has no cloud account or cross-device sync.

## Important scope note
This is a working Version 1 learning app, not a replacement for school assessment. Generated questions and AI explanations should be treated as practice material. Version 2 can add notebook/photo homework checking, teacher/parent assignments, cloud sync and a richer adaptive curriculum engine.
