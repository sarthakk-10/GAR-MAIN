<div align="center">
  <h1>🎯 GAMIFIED ACTIVE RECALL 🔫</h1>
  <p><strong>A high-stakes, tactical study application designed to make learning intense and highly engaging.</strong></p>
  
  <p>
    <a href="#-features">Features</a> •
    <a href="#%EF%B8%8F-technology-stack">Tech Stack</a> •
    <a href="#-getting-started">Installation</a> •
    <a href="#-how-to-play">How to Play</a>
  </p>
</div>

---

By combining AI-powered question generation with Russian Roulette mechanics, this app turns boring PDF study materials into a life-or-death (virtually!) battle of wits against a rogue AI. Upload your notes, answer under pressure, and survive the chambers.

## ⚡ Features

- **🧠 AI-Powered Note Parsing:** Upload your study notes or textbooks (PDF). The app uses Google's **Gemini AI** to instantly parse the text and generate a pool of challenging multiple-choice questions based *strictly* on your material.
- **💀 Escalating Roulette Mechanics:** Every question is a round. Answer correctly to arm yourself and shoot the opponent. Answer incorrectly, and the AI takes the gun. The game features a 6-chamber revolver that gets loaded with more bullets every round, meaning the risk of elimination increases from 17% in Round 1 all the way to a 100% Instant Death scenario in Round 6!
- **⏱️ Time-Limit Difficulties:** Choose your pressure level before starting the mission:
  - **UNLIMITED:** No rush. Take your time to think.
  - **60 SECONDS:** Standard tactical mode.
  - **30 SECONDS:** Hardcore mode. If the timer hits zero, you lose your turn, and the AI immediately pulls the trigger on you.
- **🖥️ Tactical Aesthetic:** A complete UI/UX designed around a gritty, amber-glow military CRT terminal, featuring perspective grids, CRT scanlines, and immersive dark-mode aesthetics.
- **🤖 Adaptive AI Personalities:** Face off against three distinct AI bots depending on your chosen difficulty level:
  - **CADET_7** - A nervous, inexperienced combat AI.
  - **WARDEN** - A strict, protocol-driven enforcer.
  - **CIPHER** - A cold, calculating mathematical probability matrix.
- **🏆 Persistent Leaderboard:** All your survival runs are stored locally so you can track your high scores, accuracy, and maximum survived probability over time.

---

## 🛠️ Technology Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Framer Motion (for complex physics and glitch animations)
- **AI Integration:** Google Gemini API (Requires user-provided API key)
- **Audio:** HTML5 Audio API for immersive clicks, dings, and bangs.
- **PDF Parsing:** `pdfjs-dist` for local client-side text extraction without server overhead.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/sarthakk-10/GAR-MAIN.git
cd GAR-MAIN
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
3. Paste your key and hit **Save**. (The key is stored securely in your browser's local storage).

---

## 🎮 How to Play

1. **Configure:** Enter your agent callsign (username), select a time limit difficulty, and choose how many total questions to extract (5, 10, or 15).
2. **Upload:** Drop your study material PDF into the terminal or paste raw text.
3. **Load Gun:** Start the mission. The AI will generate questions based *only* on your uploaded text.
4. **Survive:** 
   - **Correct Answer:** You get the gun. Choose to shoot the Opponent or take a risk and shoot Yourself for bonus points. 
   - **Incorrect / Timeout:** The Opponent steals the gun and aims at you. 
   - **The Cylinder:** Watch the chamber index. Round 1 has 1 bullet in 6 chambers (16.7%). Round 5 has 5 bullets in 6 chambers (83.3%). It takes multiple hits to kill the opponent or die trying. 

Good luck, Candidate. 

---
*// SYSTEM TERMINAL SECURE // PROTOCOL ACTIVE //*
