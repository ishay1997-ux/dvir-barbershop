# ♿ מדריך אינטגרציה מלא: רכיב נגישות גלובלי (Universal Accessibility Suite)
> **גרסה:** 3.0 · **תקן:** WCAG 2.1 AA · **מחבר:** Antigravity / The Cut Platform
> קובץ זה מרכז את כל ההנחיות, הדרישות והטיפים להטמעה מהירה של רכיב הנגישות בכל אתר או אפליקציית ווב עתידית.

---

## 🌟 סקירה כללית
רכיב הנגישות הוא **מערכת מודולרית עצמאית לחלוטין (Drop-in)**.
כל העיצובים, הלוגיקה, מנוע ההקראה הקולית, המקלדת הווירטואלית, תרגומי השפות ומנגנון שמירת הנתונים – מובנים בתוך תיקייה אחת בלבד.

---

## 🚀 3 שלבים להטמעה בכל פרויקט (פחות מדקה)

### שלב 1: העתקת התיקייה
העתק את כל התיקייה `accessibility/` אל תיקיית הרכיבים בפרויקט החדש שלך:
```text
src/
  components/
    accessibility/          <--- העתק לכאן את כל התיקייה
      components/           (תת-רכיבים)
      AccessibilityWidget.tsx
      accessibility.css     (עיצובים מבודדים מובנים)
      i18n.ts               (מילון 4 שפות: עברית, אנגלית, ערבית, רוסית)
      SkipToContent.tsx
      types.ts
      useAccessibility.ts
      useSpeechSynthesis.ts
      index.ts
```

---

### שלב 2: התקנת שתי תלויות סטנדרטיות (Dependencies)
אם הפרויקט שלך עדיין אינו כולל אותן, הרץ בטרמינל:
```bash
npm install framer-motion lucide-react
```
*(אם אתה משתמש ב-yarn או pnpm: `pnpm add framer-motion lucide-react` / `yarn add framer-motion lucide-react`)*

---

### שלב 3: הוספת הרכיב ב-Root של האפליקציה

#### 🅰️ בפרויקט Next.js (App Router – `src/app/layout.tsx`):
```tsx
import { AccessibilityWidget, SkipToContent } from '@/components/accessibility';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        {/* כפתור דילוג לתוכן למשתמשי מקלדת */}
        <SkipToContent />

        {/* התוכן המרכזי של האתר עם תגית מזהה */}
        <main id="main-content">
          {children}
        </main>

        {/* רכיב הנגישות המלא */}
        <AccessibilityWidget 
          siteName="שם האתר / העסק שלך"
          statementUrl="/accessibility"
          defaultDockSide="left"
        />
      </body>
    </html>
  );
}
```

#### 🅱️ בפרויקט React / Vite (`src/App.tsx`):
```tsx
import { AccessibilityWidget, SkipToContent } from './components/accessibility';

export default function App() {
  return (
    <div className="app-container">
      <SkipToContent />
      
      <main id="main-content">
        {/* תוכן האפליקציה שלך */}
      </main>

      <AccessibilityWidget siteName="שם המערכת" />
    </div>
  );
}
```

---

## ⚙️ מאפיינים ופרמטרים הניתנים להתאמה (Props)

| פרמטר (Prop) | סוג (Type) | ברירת מחדל | תיאור |
| :--- | :--- | :--- | :--- |
| `siteName` | `string` | *(אופציונלי)* | שם העסק / האתר (מוצג בכותרת תצוגת הקריאה הנגישה) |
| `statementUrl` | `string` | `'/accessibility'` | נתיב לדף הצהרת הנגישות של האתר |
| `defaultDockSide` | `'left' \| 'right'` | `'left'` | צד העיגון ההתחלתי של הכפתור הצף במסך |
| `storageKey` | `string` | `'thecut_a11y_v3_state'` | מפתח ייחודי לשמירת העדפות המשתמש ב-LocalStorage |
| `defaultLanguage` | `'he' \| 'en' \| 'ar' \| 'ru'` | `'he'` | שפת ברירת המחדל של תפריט הנגישות |

---

## 📋 רשימת הכלים והפיצ'רים המובנים

1. **14 כלי נגישות מרכזיים בריבוע:**
   * ⌨️ **ניווט מקלדת:** הדגשת פוקוס כחולה בולטת על כל כפתור ושדה.
   * 🔊 **הקראת טקסט (Text to Speech):** מנוע סאונד מלא, כולל נגן צף, בקרת מהירות וגובה צליל.
   * 📜 **הקראה ממושכת (Hover-to-read):** מעבר עכבר מעל כל טקסט מקריא אותו אוטומטית.
   * 🌙 **ניגודיות כהה:** רקע שחור מלא עם טקסט צהוב וכחול זוהר (High Contrast Dark).
   * ☀️ **ניגודיות בהירה:** רקע לבן נקי עם טקסט שחור וכחול כהה (High Contrast Light).
   * 🔄 **היפוך צבעים (Invert):** הופך צבעים תוך שמירה על צבעי תמונות ווידאו מקוריים.
   * 👁️ **מונוכרום:** גווני אפור מלאים (Grayscale) למניעת עומס חזותי.
   * 🔍 **הגדלת מסך:** הגדלת תצוגה כללית ב-15% (Screen Zoom).
   * 🔤 **גופן קריא:** החלפה מיידית לפונט נקי וקריא לבעלי דיסלקציה.
   * 🖼️ **הדגשת תיאורי תמונות:** הבלטה חזותית לתמונות באתר.
   * 🔗 **הדגשת קישורים:** רקע צהוב וקו תחתון מודגש לכל הלינקים.
   * 🏷️ **הדגשת כותרות:** מסגרת כחולה בולטת לכל כותרות העמוד.
   * 📖 **מצב קריאה נקי:** חלון ללא הסחות דעת עם אפשרות הדפסה מיידית.
   * 🔎 **הגדלת טקסט (1..5):** הגדלת גודל הטקסט עד 150%.
   * ⌨️ **מקלדת וירטואלית:** מקלדת על המסך להקלדה בלחיצות עכבר.

2. **ספקטרום צבעים אישי (Color Spectrum):**
   * שינוי גוון בלייב עבור **רקעים**, **כותרות** או **תוכן**.

3. **סמני עכבר ענקיים (Large Mouse Cursors):**
   * סמן ענק שחור וסמן ענק לבן בעלי קו מתאר מנוגד.

4. **התאמות גופנים וריווחים:**
   * גודל גופן, ריווח מילים, גובה שורה, ריווח אותיות.

5. **הסתרת הווידג'ט לפרקי זמן מוגדרים:**
   * לכרטיסייה הנוכחית בלבד, ל-24 שעות, לשבוע, לחודש.

6. **קיצורי מקלדת בינלאומיים:**
   * `Alt + A` (או `Alt + ש`) – פתיחה/סגירה של תפריט הנגישות.
   * `Escape` – סגירת כל המודאלים והתפריט.

---

## 💡 טיפים מומלצים למפתחים (Best Practices)

### 1. אלמנטים שרוצים להחריג מפילטרים (`a11y-ignore`)
אם יש לך באתר אלמנט שלא תרצה שפילטרים כמו היפוך צבעים או ניגודיות ישנו אותו (לדוגמה: נגן יוטיוב, מצלמת וידאו חיה, או קנבס ציור), הוסף לו פשוט את המחלקה:
```html
<div className="a11y-ignore">
  <!-- תוכן שיישאר ללא שינוי צבעים -->
</div>
```

### 2. קישור למשתמשי מקלדת
וודא שהתגית הראשית של האתר כוללת `id="main-content"`. זה מאפשר ללחוץ `Tab` בעת כניסה לאתר, ללחוץ `Enter` ולדלג מיד מעל ה-Navbar אל תוכן העמוד!

### 3. Tailwind CSS / CSS Modules
קובץ `accessibility.css` המצורף מוגדר עם סלקטורים חזקים (`!important` ממוקד) הפועלים ישירות מול `html` ו-`body`. זה מבטיח שהנגישות תגבר על כל ספריית עיצוב – כולל Tailwind CSS, Bootstrap, Material-UI, או Styled Components.

---

## 📞 שאלות ותחזוקה
במידה ותרצה להוסיף שפות נוספות (למשל צרפתית, ספרדית), פשוט פתח את `src/components/accessibility/i18n.ts` והוסף מפתח שפה נוסף למערך `A11Y_I18N`.
