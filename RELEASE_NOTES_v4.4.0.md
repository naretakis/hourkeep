# Release Notes - v4.4.0

**Release Date:** November 10, 2025

## 🎨 Warm Neutral Theme

HourKeep gets a visual refresh with a warm, approachable color palette that moves beyond generic Material-UI while keeping things simple and accessible.

---

## What's New

### New Color Palette

Say goodbye to generic blue! HourKeep now features:

- **Muted purple primary** (#6B4E71) - Warm and approachable
- **Warm tan/gold secondary** (#D4A574) - Complements the purple beautifully
- **Earthy green success** (#5C8D5A) - For compliance status
- **Warm orange warning** (#D97D54) - For attention items
- **Warm off-white background** (#FAF9F7) - Easier on the eyes than stark white

### Design Improvements

- **More rounded corners** - Friendlier, softer feel (16px instead of 12px)
- **Pill-shaped chips** - Activity type badges are now more rounded
- **Thicker progress bars** - Better visibility (12px instead of 10px)
- **Softer shadows** - Purple-tinted shadows that match the color scheme
- **Better buttons** - No more shouty uppercase, smooth hover effects
- **Modern typography** - Tighter letter spacing for a contemporary look

---

## Why This Theme?

### Distinctive

Purple and tan stand out from the sea of blue apps. HourKeep now has its own visual identity.

### Friendly

Warm colors are psychologically calming - perfect for users dealing with stressful benefit requirements.

### Professional

Still trustworthy and official-feeling, just less institutional.

### Accessible

Maintains good contrast ratios for readability while being easier on the eyes.

### Supportive

Feels like a community tool rather than a government form.

---

## Technical Details

- Updated theme configuration in `src/theme/theme.ts`
- Updated meta theme-color for mobile browser chrome
- Added component-level style overrides
- Updated PWA manifest theme color
- No breaking changes - purely visual enhancement

---

## Upgrade Instructions

### For Users

1. Refresh the app (or it will auto-update)
2. Enjoy the new look!
3. All your data remains exactly as it was

**No action required** - this is a visual-only update.

### For Developers

```bash
git pull origin main
npm install
npm run dev
```

---

## Screenshots

The new theme features:

- Warm purple buttons and headers
- Earthy green compliance indicators
- Tan/gold accents
- Softer, more rounded components
- Warm off-white backgrounds

---

## What's Next

See our [Roadmap](ROADMAP.md) for upcoming features:

- **v5.0+** - Income tracking, hardship reporting, compliance alerts

---

## Links

- **Live App:** https://naretakis.github.io/hourkeep
- **Source Code:** https://github.com/naretakis/hourkeep
- **Issues:** https://github.com/naretakis/hourkeep/issues
- **Full Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

**Thank you for using HourKeep!**

_Keep Your Hours, Keep Your Coverage_ 💜
