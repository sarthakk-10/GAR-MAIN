# GAMIFIED ACTIVE RECALL 🎯🔫

**Gamified Active Recall** is a high-stakes, tactical study application designed to make learning intense and highly engaging. By combining AI-powered question generation with Russian Roulette mechanics, this app turns boring PDF study materials into a life-or-death (virtually!) battle of wits against a rogue AI.

---

## ⚡ Features

- **AI-Powered PDF Parsing:** Upload your study notes or textbooks (PDF). The app uses Google's **Gemini AI** to instantly parse the text and generate a pool of challenging multiple-choice questions.
- **Russian Roulette Mechanics:** Every question is a round in the chamber. Answer correctly to arm yourself and shoot the opponent. Answer incorrectly, and the AI takes the gun. If the chamber lands on a bullet—game over.
- **Tactical Aesthetic:** A complete UI/UX designed around a gritty, amber-glow military CRT terminal, featuring perspective grids, CRT scanlines, and immersive dark-mode aesthetics.
- **Adaptive AI Personalities:** Face off against three distinct AI bots depending on your chosen difficulty level:
  - **CADET_7** (Easy) - A nervous, inexperienced combat AI.
  - **WARDEN** (Medium) - A strict, protocol-driven enforcer.
  - **CIPHER** (Hard) - A cold, calculating mathematical probability matrix.
- **Dynamic Web Audio System:** Real-time audio synthesis (no heavy asset downloads!) utilizing the browser's Web Audio API for immersive 'clicks', 'dings', and 'bangs'. Fully customizable with local MP3 overrides.
- **Persistent Leaderboard:** All your survival runs are stored locally so you can track your high scores, accuracy, and maximum survived probability over time.

---

## 🛠️ Technology Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Framer Motion (for complex physics and glitch animations)
- **AI Integration:** Google Gemini API (Requires user-provided API key)
- **Audio:** Native Web Audio API
- **PDF Parsing:** `pdfjs-dist` for local client-side text extraction without server overhead.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/sarthakk-10/GAMIFIED-ACTIVE-RECALL.git
cd GAMIFIED-ACTIVE-RECALL
npm install
```

### 2. Running Locally
Start the Vite development server:
```bash
npm run dev
```

### 3. Setup Gemini API Key
To use the question generation feature, you need a Google Gemini API key:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Open the app, click the **Settings** icon (gear) in the top right navbar.
3. Paste your key and hit Save. (The key is stored securely in your browser's local storage).

---

## 🎮 How to Play

1. **Configure:** Enter your username, select a difficulty level, and set the number of questions.
2. **Upload:** Drop your study material PDF into the terminal.
3. **Load Gun:** Start the mission. The AI will generate questions based *only* on your uploaded text.
4. **Survive:** 
   - Get the question right, and you get to pull the trigger on the Bot (or take a risk on yourself for style points). 
   - Get it wrong, and the Bot takes the gun and aims at you. 
   - Watch the chamber tracker and risk probability. It takes 3 hits to kill the opponent or die trying. 

Good luck, Candidate. 

---
*// SYSTEM TERMINAL SECURE // PROTOCOL ACTIVE //*
