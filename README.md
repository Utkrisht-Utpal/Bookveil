# Bookveil — An Editorial Sanctuary for Digital Volumes

> *Transform cold glass into the warm sanctuary of an open volume.*

**Bookveil** is a distraction-free, privacy-first in-browser digital reader engineered to restore the physical intimacy, acoustic warmth, and quiet reverence of reading a real physical book.

---

## 📖 About The Project

Modern digital readers often treat books as generic, endless streams of data or surround them with cluttered toolbars, ads, and algorithmic distractions. The weight in your hands, the delicate curve of the spine, the gentle paper rustle as a leaf turns, and generous margins that give thoughts room to breathe were lost.

**Bookveil** restores this intimacy. It brings physical two-page spread simulation, realistic spring-based corner page-turning physics, real-time procedural acoustic sound synthesis, and timeless editorial typography to your documents—all running entirely in your browser with zero data leaving your device.

---

## 🌟 Core Features & Capabilities

### 1. Physical 3D Page Physics & Acoustic Audio
* **Realistic Two-Page Spread**: Modeled desktop/laptop book spreads featuring natural center spine depth, gutter shadow gradients, realistic paper thickness, and edge lighting.
* **Interactive Corner Dragging**: Drag top or bottom corners with realistic curvature, or swipe with natural spring dynamics to turn pages.
* **Procedural Paper Rustle Synthesizer**: Low-latency, real-time procedural audio synthesized using the Web Audio API (white noise filtered through parametric bandpass curves) whenever a page turns. Includes volume control and instant mute.
* **Adaptive Dual View Modes**: Seamlessly switch between the **Immersive 3D Page-Flip View** and a **Continuous Scroll View** for linear document streams on any device.

### 2. Editorial Typography & Atmospheric Themes
* **7 Curated Reading Palettes**:
  * **Classic**: Warm Ivory `#F5F1E8` with deep charcoal typography.
  * **Ivory**: Soft warm off-white `#FAF6EE` with gentle earth tones.
  * **Sepia**: Vintage library parchment `#F4ECD8` with warm brown ink.
  * **Parchment**: Antique paper `#EFE7D5` with rich aged contrast.
  * **Midnight**: Obsidian `#121411` with soft luminous off-white text.
  * **Forest**: Deep evergreen `#151C16` with muted sage typography.
  * **Minimal**: Clean crisp white `#FFFFFF` with pure neutral tones.
* **Editorial Font Pairings**: Support for *Cormorant Garamond*, *Playfair Display*, *Lora*, *Merriweather*, and *Inter*.
* **Custom Reading Settings**: Fine-grained slider control over font size, line height, and margin width.

### 3. In-Browser Document Parsing & Processing
* **Native PDF Engine (`pdfjs-dist`)**: Crisp vector canvas snapshots, full-text extraction for instantaneous keyword searches, and automatic Table of Contents outline detection.
* **Smart DOCX Engine (`mammoth`)**: Converts Word documents into clean semantic HTML, automatically detects chapter headers, and formats them into elegant page spreads.
* **Zero-Server Processing**: All document parsing is handled entirely on the client side using Web Workers and vector rendering.

### 4. 100% Offline & Private Storage
* **IndexedDB Database (`Dexie.js`)**: Uploaded books, bookmarks, highlights, notes, and reading positions are persisted locally.
* **No Cloud Dependency**: Works completely offline. Documents never leave your device.

### 5. Distraction-Free Reading Experience
* **Auto-Hiding Toolbar**: Floating toolbars fade away during active reading and re-appear smoothly on cursor motion, touch, or pressing `H`.
* **Dynamic Reading Velocity Engine**: Calculates reading speed and projects accurate time remaining per chapter and volume (e.g. `17 / 99 · 16% · ~96 min left`).
* **Text Highlights & Personal Notes**: Select text to highlight in *Sage*, *Antique Gold*, or *Rose*, or attach personal notes and margin annotations.
* **Navigation & Utilities**: Full-text search with highlighted occurrences (`S`), navigable Table of Contents (`C`), bookmarks panel (`B`), and instant fullscreen mode (`F`).
* **Book Opening & Completion**: Calming cover-opening transitions and volume completion summaries with a gentle celebratory flourish.

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
| :--- | :--- |
| `→` / `Space` / `Page Down` | Next Page |
| `←` / `Shift + Space` / `Page Up` | Previous Page |
| `H` | Toggle Auto-Hiding Toolbar |
| `F` | Toggle Fullscreen Mode |
| `B` | Bookmark Current Page |
| `S` | Open Full-Text Search |
| `C` | Open Table of Contents |
| `T` | Open Reading Theme Selector |
| `N` | Open Notes & Highlights Panel |
| `?` | View Keyboard Shortcuts Modal |
| `Esc` | Close Active Panels or Modals |

---

## 🛠️ Technology Stack

* **Framework & UI**: React 19, TypeScript, Vite
* **Styling & Layout**: Tailwind CSS 4, Framer Motion, Lucide Icons
* **Document Engines**: `pdfjs-dist` (PDF vector rendering & text extraction), `mammoth` (DOCX parsing)
* **Audio Synthesis**: Web Audio API (real-time procedural white noise & bandpass filtering)
* **Storage**: Dexie.js (IndexedDB wrapper)
* **Effects**: Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or newer)
* [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Utkrisht-Utpal/Bookveil.git
   cd Bookveil
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📄 License & Philosophy

Bookveil is designed for lovers of typography, physical books, and undisturbed focus. Built with intention and care.
