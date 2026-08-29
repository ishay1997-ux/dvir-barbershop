# ♿ מדריך אינטגרציה מלא: רכיב נגישות גלובלי (Universal Accessibility Suite)
> **גרסה:** 3.1 · **תקן:** WCAG 2.1 AA & ת"י 5568 · **מחבר:** The Cut Platform / Universal Accessibility
> קובץ זה מרכז את כל ההנחיות, הדרישות, הטיפים והתבניות המשפטיות להטמעה מהירה של רכיב הנגישות בכל אתר או אפליקציית ווב עתידית.

---

## 🌟 סקירה כללית
רכיב הנגישות הוא **מערכת מודולרית עצמאית לחלוטין (100% Drop-in & Standalone)**.
כל העיצובים, הלוגיקה, מנוע ההקראה הקולית (Web Speech API), המקלדת הווירטואלית, תרגומי השפות (4 שפות), מנגנון שמירת הנתונים ב-LocalStorage ו-SessionStorage, ומודאל הסתרת הווידג'ט – מובנים ומבודדים בתוך תיקייה אחת בלבד.

---

## 🚀 3 שלבים להטמעה בכל פרויקט (פחות מדקה)

### שלב 1: העתקת התיקייה
העתק את כל התיקייה `src/components/accessibility/` אל תיקיית הרכיבים בפרויקט החדש שלך:
```text
src/
  components/
    accessibility/          <--- העתק לכאן את כל התיקייה
      components/           (14 תת-רכיבים מודולריים)
      AccessibilityWidget.tsx
      accessibility.css     (עיצובים מבודדים ומבוססי CSS Variables)
      i18n.ts               (מילון 4 שפות: עברית, אנגלית, ערבית, רוסית + RTL/LTR)
      SkipToContent.tsx     (כפתור דילוג לתוכן נגיש למקלדת)
      types.ts              (טיפוסי TypeScript מלאים)
      useAccessibility.ts   (Hook לניהול State ו-Persistence)
      useSpeechSynthesis.ts (Hook מנוע הקראה קולית חכם)
      index.ts              (Barrel Export נקי)
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

      <AccessibilityWidget 
        siteName="שם המערכת" 
        statementUrl="/accessibility"
      />
    </div>
  );
}
```

---

## ⚙️ מאפיינים ופרמטרים הניתנים להתאמה (Props)

| פרמטר (Prop) | סוג (Type) | ברירת מחדל | תיאור |
| :--- | :--- | :--- | :--- |
| `siteName` | `string` | *(אופציונלי)* | שם העסק / האתר (מוצג בכותרת תצוגת הקריאה הנגישה ובמודאלים) |
| `statementUrl` | `string` | `'/accessibility'` | נתיב לדף הצהרת הנגישות של האתר |
| `defaultDockSide` | `'left' \| 'right'` | `'left'` | צד העיגון ההתחלתי של הכפתור הצף במסך |
| `storageKey` | `string` | `'thecut_a11y_v3_state'` | מפתח ייחודי לשמירת העדפות המשתמש ב-LocalStorage |
| `defaultLanguage` | `'he' \| 'en' \| 'ar' \| 'ru'` | `'he'` | שפת ברירת המחדל של תפריט הנגישות |

---

## 📋 רשימת הכלים והפיצ'רים המובנים

1. **14 כלי נגישות מרכזיים בגריד משבצות אינטראקטיבי:**
   * ⌨️ **ניווט מקלדת:** הדגשת פוקוס כחולה בולטת על כל כפתור ושדה (`Tab` / `Shift+Tab`).
   * 🔊 **הקראת טקסט (Text to Speech):** מנוע סאונד מלא עם נגן צף, בקרת מהירות, השהייה ועצירה.
   * 📜 **הקראה ממושכת (Hover-to-read):** מעבר עכבר מעל כל טקסט מקריא אותו אוטומטית.
   * 🌙 **ניגודיות כהה:** רקע שחור מלא עם טקסט צהוב וכחול זוהר (High Contrast Dark).
   * ☀️ **ניגודיות בהירה:** רקע לבן נקי עם טקסט שחור וכחול כהה (High Contrast Light).
   * 🔄 **היפוך צבעים (Invert):** הופך צבעים תוך שמירה על צבעי תמונות ווידאו מקוריים.
   * 👁️ **מונוכרום:** גווני אפור מלאים (Grayscale) למניעת עומס חזותי.
   * 🔍 **הגדלת מסך:** הגדלת תצוגה כללית ב-15% (Screen Zoom).
   * 🔤 **גופן קריא:** החלפה מיידית לפונט נקי וקריא המותאם לבעלי דיסלקציה.
   * 🖼️ **הדגשת תיאורי תמונות:** הבלטה חזותית והצגת תגיות `alt` לכל תמונה.
   * 🔗 **הדגשת קישורים:** רקע צהוב וקו תחתון מודגש לכל הלינקים.
   * 🏷️ **הדגשת כותרות:** מסגרת כחולה בולטת לכל כותרות העמוד (`H1`-`H6`).
   * 📖 **מצב קריאה נקי (Reader Mode):** חלון מבודד ללא הסחות דעת, עם תמיכה בהדפסה מיידית.
   * 🔎 **הגדלת טקסט (רמות 1..5):** הגדלת גודל הטקסט עד 150%.
   * ⌨️ **מקלדת וירטואלית:** מקלדת על המסך להקלדה ישירה בלחיצות עכבר.

2. **ספקטרום צבעים אישי (Color Spectrum):**
   * שינוי גוון צבע (Hue) בזמן אמת עבור **רקעים**, **כותרות** או **תוכן**.

3. **סמני עכבר ענקיים (Large Mouse Cursors):**
   * סמן ענק שחור וסמן ענק לבן בעלי קו מתאר מנוגד לנראות מרבית.

4. **התאמות גופנים וריווחים מתקדמות:**
   * גודל גופן (Font Size), ריווח מילים (Word Spacing), גובה שורה (Line Height), ריווח אותיות (Letter Spacing).

5. **הסתרת הווידג'ט (Hide Widget):**
   * אפשרות למשתמש להסתיר את הכפתור הצף לכרטיסייה הנוכחית, ל-24 שעות, לשבוע או לחודש (נשמר ב-LocalStorage/SessionStorage).

6. **קיצורי מקלדת בינלאומיים מובנים:**
   * `Control + F10` או `Alt + A` (או `Alt + ש`) – פתיחה/סגירה מיידית של תפריט הנגישות.
   * `Control + F11` – הפעלה מהירה של מצב קורא-מסך ועיוורון.
   * `Escape` – סגירת כל המודאלים ותפריט הנגישות.
   * `Enter` בראש הדף – קפיצה ישירה לתוכן המרכזי באמצעות `SkipToContent`.

---

## 💡 טיפים מומלצים למפתחים (Best Practices)

### 1. אלמנטים שרוצים להחריג מפילטרים (`a11y-ignore`)
אם יש לך באתר אלמנט שלא תרצה שפילטרים כמו היפוך צבעים או ניגודיות ישנו אותו (לדוגמה: נגן יוטיוב, מצלמת וידאו חיה, או קנבס ציור), הוסף לו פשוט את המחלקה:
```html
<div className="a11y-ignore">
  <!-- תוכן שיישאר ללא שינוי צבעים -->
</div>
```

### 2. קישור למשתמשי מקלדת (`id="main-content"`)
וודא שהתגית הראשית של האתר כוללת `id="main-content"`. זה מאפשר ללחוץ `Tab` בעת כניסה לאתר, ללחוץ `Enter` ולדלג מיד מעל ה-Navbar אל תוכן העמוד!

### 3. Tailwind CSS / CSS Modules
קובץ `accessibility.css` המצורף מוגדר עם סלקטורים חזקים (`!important` ממוקד) הפועלים ישירות מול `html` ו-`body`. זה מבטיח שהנגישות תגבר על כל ספריית עיצוב – כולל Tailwind CSS, Bootstrap, Material-UI, או Styled Components.

---

## 📁 תבניות משפטיות נלוות (Legal Templates)
לכל אתר חדש שאתה בונה, הכנו עבורך 3 תבניות Markdown עם Placeholders מוכנים בתיקייה `LEGAL_TEMPLATES/`:
1. `terms-template.md` – תקנון ותנאי שימוש מלאים (כולל קניין רוחני, חוק הספאם והגבלת אחריות).
2. `privacy-template.md` – מדיניות פרטיות ואבטחת מידע (כולל טבלת עוגיות, תאימות GDPR ושמירת נתונים).
3. `accessibility-template.md` – הצהרת נגישות תקנית (ת"י 5568 / WCAG 2.1 AA).

---

## 📞 יצירת קשר ותמיכה
* טלפון / WhatsApp לפניות: `058-781-5070`
* דוא"ל תמיכה ונגישות: `support@thecut.co.il`
* תאריך עדכון אחרון: **30 באוגוסט 2026**
