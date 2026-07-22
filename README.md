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
2. Create a `.env` file in the root of the project directory.
3. Add the following line to the file, replacing `your_api_key_here` with your actual key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

---

## 🎮 How to Play

1. **Configure:** Enter your agent callsign (username) and select a time limit difficulty.
2. **Upload:** Drop your study material PDF into the terminal or paste raw text.
3. **Load Gun:** Start the mission. The AI will generate questions based *only* on your uploaded text.
4. **Survive & Score:** 
   - **Correct Answer (+100 pts):** You get the gun.
   - **Shoot Opponent:** Hit them for **+300 pts** (they lose 500), or miss (click) and they gain **+200 pts**.
   - **Shoot Yourself:** Prove your bravery! If you survive a click, you gain **+200 pts**. If you shoot yourself (bang), you lose **-500 pts**.
   - **Incorrect / Timeout:** The Opponent gains +100 pts, steals the gun, and aims at you. If they hit you (bang), you lose **-500 pts** and they gain **+300 pts**. If you survive (click), you get a **+200 pts** relief bonus!
   - **The 36-Shot Gauntlet:** The game consists of 6 escalating rounds (36 questions total). Every 6 shots fired, you advance to the next round, and the revolver gets loaded with an additional bullet. Round 1 starts with 1 bullet (16.7% risk), progressing all the way to Round 6 (6 bullets - 100% Instant Death!). Survive all 36 shots to complete the mission and record your high score! 

Good luck, Candidate. 

---
*// SYSTEM TERMINAL SECURE // PROTOCOL ACTIVE //*
