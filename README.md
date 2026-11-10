# קטלוג מוצרים

אפליקציית אינטרנט לגלישה בקטלוג מוצרים, עם מסכי רשימת מוצרים ופרטי מוצר בודד. האפליקציה בנויה ב-React עם TypeScript, משתמשת ב-React Router לניווט בין עמודים ומבצעת קריאות API ל-HTTP endpoints המוגדרים ב-`src/config.ts`.

## תיאור המערכת

הפרויקט מציג:

- תצוגת כל המוצרים
- סינון לפי קטגוריה
- כרטיסי מוצר עם מחיר ותיאור
- דף פרטי מוצר
- עיצוב RTL (תמיכה בעברית)
- טעינת נתונים בזמן אמת מאתרי AWS Lambda ציבוריים

## טכנולוגיות

- React 19
- TypeScript
- Vite
- React Router DOM
- CSS Modules/inline styles (במסגרת קובצי העיצוב הקיימים)

## מבנה הפרויקט

```text
product-catalog/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.tsx
│   ├── config.ts
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   ├── assets/
│   └── pages/
│       ├── ProductPage.tsx
│       └── ProductsPage.tsx
└── README.md
```

## נקודות עיקריות בקוד

### `src/config.ts`
קובץ זה מכיל את `ENDPOINTS` לשני קצבי API:

- `productsByCategory` - מחזיר רשימת מוצרים לפי קטגוריה
- `productById` - מחזיר פריט בודד לפי מזהה מוצר וקטגוריה

### `src/pages/ProductsPage.tsx`
עמוד ראשי: מציג את כל הקטגוריות, מאפשר מעבר בין קטגוריות ומציג את המוצרים הרלוונטיים.

### `src/pages/ProductPage.tsx`
עמוד פרטי מוצר: טוען את המוצר לפי `productId` ומציג נתונים נוספים, כולל תיאור, קטגוריה ומאפיינים נוספים.

### `src/types.ts`
מכיל את טיפוסי המודלים של `Category` ו-`Product`.

## הפעלה מקומית

### דרישות מוקדמות

- Node.js 18+
- npm

### התקנה

```bash
npm install
```

### הרצת אפליקציה במצב פיתוח

```bash
npm run dev
```

לאחר מכן פתח את הכתובת שמופיעה בטרמינל, בדרך כלל:

```text
http://localhost:5173
```

### בניית הפרויקט

```bash
npm run build
```

### הצגת הבנייה המקומית

```bash
npm run preview
```

## תצורת API

היישום משתמש ב-POST requests ל-URLs של AWS Lambda. לדוגמה:

- שליפת מוצרים לפי קטגוריה
- שליפת מוצר בודד לפי מזהה

אם אתה מעדכן את ה-API, יש לעדכן את כתובות ה-Endpoints בקובץ `src/config.ts`.

## תכונות עיקריות

- סרגל קטגוריות עם אייקונים
- כרטיסי מוצר אינטראקטיביים
- ניווט בין עמודי קטלוג ופרטי מוצר
- עיצוב מודרני, כהה ומרשים
- תמיכה מלאה בעברית (RTL)

## הערות

הפרויקט אינו כולל Backend פנימי; הוא תלוי ב-API חיצוני. לכן, אם ה-API אינו זמין, תופיע הודעת שגיאה בדף.

## ריצה עם npm scripts

```bash
npm run dev     # פיתוח
npm run build   # בניית production
npm run preview # טעינת build מקומי
npm run lint   # בדיקת קוד (באמצעות oxlint)
```

## מפתח/שימוש

הפרויקט נועד כ-demo לעבודה עם קטלוג מוצרים, ומאפשר להרחבה בקלות להוספת:

- חיפוש
- מיון
- עגלות קנייה
- עמודי לוגין
- חיבור ל-API אמיתי/מסד נתונים
