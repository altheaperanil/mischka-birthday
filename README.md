# Mishka Ayara's Chiikawa Birthday Surprise 🎂💗

A cute, interactive birthday website made with plain **HTML, CSS, and JavaScript** — no build tools needed.

## 🌸 Quick Start

1. Download or clone this folder.
2. Double-click `index.html` to open it in your browser.
   That's it — no installation, no commands. ✨

## ✏️ Personalize the Content

You only need to edit **one file**: `js/content.js`.

Inside you'll find:

- **`photos`** — The scrapbook gallery. Replace `"PASTE_YOUR_PHOTO_URL_HERE"` with real image links.
- **`video.url`** — Paste either:
  - a YouTube link: `https://www.youtube.com/watch?v=XXXXXXXXXXX`
  - a direct MP4: `https://example.com/video.mp4`
- **`video.thumbnail`** — Optional poster image URL.
- **`balloons`** — The 11 balloons in the popping game. Each has:
  - `color` — the balloon's color (any CSS color)
  - `photo` — the image URL revealed when that balloon is popped
  - `caption` — a short message shown under the photo
- **`letter.paragraphs`** — The full birthday letter (already filled in).
- **`starWishes`** — Messages hidden inside each floating lantern in the final surprise.
- **`finalLanternMessage`** — The closing message shown after all lanterns.

Everything else updates automatically. You never need to touch `app.js` or `styles.css`.

### 🎈 How to add photos to the balloons

Open `js/content.js` and find the `balloons` array. Replace each `"PASTE_YOUR_PHOTO_URL_HERE"` with a real image link:

```js
{ color: "#FFB7D5", photo: "https://i.imgur.com/yourphoto1.jpg", caption: "A memory I treasure ♡" },
{ color: "#B7E2F7", photo: "https://i.imgur.com/yourphoto2.jpg", caption: "You being wonderful ✨" },