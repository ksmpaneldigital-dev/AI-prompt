# AI Khmer Songwriter Pro (ស្ទូឌីយោតែងទំនុកច្រៀង AI)

> Professional AI Song Lyrics, Poetic Rhyme & Music Style Generator for Khmer and Bilingual Creators, optimized for Suno AI & Udio creation.

![AI Khmer Songwriter Pro](https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

1. **Khmer & English Dual-Language Support (Khmer Primary)**
   - Beautiful, natural Khmer lyrical meters (ចុងចួន, ព្យាង្គរណ្តំ, កាព្យពាក្យ៧/ពាក្យ៨).
   - Instant language switch between Khmer (`ខ្មែរ`) and English.

2. **Intelligent Prompt Analysis**
   - Automatically detects song title, theme, story, language, emotional mood, genre, vocal type, instruments, tempo/BPM, duration, and rap verse requirements.
   - All parameters are fully editable before generating.

3. **Structured Khmer Lyrics Generation**
   - Professional song structure with standardized Suno-compatible tags: `[Intro]`, `[Verse 1]`, `[Pre-Chorus]`, `[Chorus]`, `[Verse 2]`, `[Rap Verse]`, `[Bridge]`, `[Final Chorus]`, `[Outro]`.
   - Adjustable song duration, rhyme density, and emotional intensity.

4. **Suno AI Prompt Builder**
   - Individual fields for Song Title, Lyrics, Style of Music (<120 characters), Exclude Styles (Negative Prompt), and Additional Studio Instructions.
   - Individual Copy buttons and a single **"Copy All for Suno AI"** button formatted for Suno AI Custom Mode.

5. **Rich Lyrics Editing Studio**
   - Full in-browser editor with Undo/Redo history, Find & Replace, and word/line counters with estimated singing duration (~85 words/min).
   - Quick section tag insertions.
   - Selection-aware regeneration (highlight any verse or chorus to rewrite it).
   - 1-Click AI actions: Improve Rhymes, Enhance Emotion, Simplify for Singing, Add/Remove Rap, Translate, and Shorten.

6. **Advanced AI Studio Tools**
   - **3 Alternative Chorus Hooks**: Generate and audition 3 distinct chorus melodies and replace with 1 click.
   - **YouTube Release Package**: 3 click-worthy titles, SEO description, hashtags, and a detailed text-to-image prompt for YouTube thumbnails.
   - **Arrangement & Instrumentation Guide**: Tempo/BPM suggestions, scale keys, section dynamics, and audio mixing/EQ tips.

7. **Project Library & Exports**
   - Local storage persistence for guest users.
   - Search by title and filter by genre.
   - Duplicate projects.
   - Export songs to `.TXT`, `.MD` (Markdown), or `.JSON`.
   - Fail-safe state protection: Current lyrics are never lost if generation fails.

8. **AI Provider Abstraction & Demo Mode**
   - Backed by Google Gemini API (`gemini-3.8-flash`) via the modern `@google/genai` SDK on the server side.
   - Automatic, graceful fallback to offline Demo Mode when `GEMINI_API_KEY` is not set, with sample content clearly labeled.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, Lucide React icons, Motion
- **Backend**: Node.js, Express, TSX, `@google/genai` (Gemini 3.8 Flash)
- **Deployment**: Supports both Node.js server (`server.ts`) and serverless platforms like Netlify (`netlify.toml` + `netlify/functions/api.ts`)

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- Node.js (version 20 or higher recommended)
- npm or yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API Key in `.env`:
```env
GEMINI_API_KEY="your-actual-gemini-api-key"
PORT=3000
```
*(Note: If `GEMINI_API_KEY` is not provided, the studio automatically runs in Demo Mode with domain-accurate sample presets and actions).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build

```bash
# Build frontend assets into /dist
npm run build

# Start production server
npm start
```

---

## ☁️ Netlify Deployment

This repository includes full Netlify support out of the box:
- `netlify.toml` configured with build commands and API function rewrites
- `netlify/functions/api.ts` serverless API endpoint

### Deploying to Netlify:
1. Connect your repository to Netlify.
2. In Netlify Site Settings > **Environment Variables**, set:
   - `GEMINI_API_KEY`: Your Gemini API key.
3. Deploy! Netlify will automatically build the React frontend and deploy the serverless functions under `/.netlify/functions/api`.

---

## 📜 License
Apache-2.0
