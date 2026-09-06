# ♿ Universal Accessibility Widget Suite

A modern, highly modular accessibility suite for React & Next.js applications. It is a **user-side supplement**: it does not make a site WCAG-compliant by itself — the host markup (labels, contrast, focus, alt text, RTL) still has to be right and verified with a checker such as axe.

> **Requirements (v3.2):** React 18+, `framer-motion`, `lucide-react`, and **Tailwind CSS v4** — the widget's own UI is built from Tailwind v4 utility classes (a Tailwind-free build is planned). Works in Next.js and Vite alike (no `next/*` imports).

---

## 📦 How to use in any new project (3 Simple Steps)

### Step 1: Copy the Folder
Copy the entire `src/components/accessibility/` folder into your new project.

### Step 2: Ensure Dependencies
Make sure your project has standard dependencies:
```bash
npm install framer-motion lucide-react
# plus Tailwind CSS v4 configured in the host (the widget's own UI depends on it)
```

### Step 3: Add to your Root Layout / App
In your `layout.tsx` or `App.tsx`:

```tsx
import { AccessibilityWidget, SkipToContent } from '@/components/accessibility';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <SkipToContent />
        {children}
        <AccessibilityWidget 
          siteName="שם העסק / האתר שלך" 
          statementUrl="/accessibility" 
          defaultDockSide="left"
        />
      </body>
    </html>
  );
}
```

---

## ⚙️ Available Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `siteName` | `string` | `undefined` | Business or site title (used in clean reader view & headers) |
| `statementUrl` | `string` | `'/accessibility'` | Custom link to accessibility statement page |
| `defaultDockSide` | `'left' \| 'right'` | `'left'` | Initial screen docking side for trigger button |
| `storageKey` | `string` | `'thecut_a11y_v3_state'` | Custom `localStorage` key for user preferences |
| `defaultLanguage` | `'he' \| 'en' \| 'ar' \| 'ru'` | `'he'` | Default active language |

---

## 🚀 Features Included Out-of-the-Box
* **14 Core Accessibility Tools** with interactive hover explanations
* **High Contrast Modes**: Dark contrast, Light contrast, Color Invert, Monochrome
* **Custom Color Spectrum**: Live hue adjustment for backgrounds, headings, and body text
* **Typography Controls**: Font size (up to 150%), line height, word spacing, letter spacing
* **Mouse Cursors**: Large black & Large white cursors with high-contrast outlines
* **Smart Web Speech Synthesis**: Text-to-Speech audio player + continuous hover-to-read mode + pitch & rate rotary dials
* **Virtual Keyboard**: Screen keyboard supporting Hebrew, English, Arabic, Russian
* **Dynamic Reader View**: Distraction-free clean reader view with instant print styling
* **Smart Hide Option**: Hide widget for current session, 24h, 1 week, or 1 month
* **Global Keyboard Shortcuts**: `Alt + A` / `Alt + ש` / `Ctrl + F10` toggle the menu, `Ctrl + F11` toggles keyboard-navigation focus rings, `Escape` closes everything. Toggle shortcuts are ignored while typing in a host text field.
* **Font scaling** scales the root font size (rem-based text and spacing). Text sized in fixed `px` does not scale.
* **Image outline** tool draws an outline around images; it does not display `alt` text.
* **Focus management**: the menu and its modals move focus in, trap Tab, and return focus to the trigger on close.
* **Persistence** is validated field-by-field on load; legacy saved settings are kept, corrupt values fall back per field.
