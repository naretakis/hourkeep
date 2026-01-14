# HourKeep

**Keep Your Hours, Keep Your Coverage**

HourKeep is a privacy-focused Progressive Web App that helps Medicaid beneficiaries track work, volunteer, and education hours to maintain their health coverage. All data stays on your device—no accounts, no servers, no tracking.

[Live App](https://hourkeep.app) · [Roadmap](ROADMAP.md) · [Report an Issue](https://github.com/naretakis/hourkeep/issues)

---

## Why HourKeep?

Starting January 2027, Medicaid expansion adults must meet work requirements to maintain eligibility. HourKeep helps you:

- Understand if you're exempt from requirements (many people are)
- Track hours (80/month) or income ($580/month) to stay compliant
- Capture and organize verification documents
- Export your records when it's time to submit to your agency

Everything runs locally in your browser. Your data never leaves your device.

---

## Features

### Guided Assessment

A step-by-step questionnaire analyzes your situation and recommends the easiest path to maintain coverage—whether that's claiming an exemption, tracking income, or logging hours.

### Exemption Screening

Check if you qualify for an exemption based on age, family status, health conditions, program participation, or other criteria. If you're exempt, you don't need to track anything.

### Flexible Tracking

Choose what works for you:

- **Hours mode**: Log work, volunteer, and education activities toward the 80-hour monthly requirement
- **Income mode**: Track earnings toward the $580 monthly threshold with automatic pay period conversion
- **Seasonal worker support**: 6-month income averaging for variable income

### Document Management

Photograph or upload pay stubs, volunteer letters, and other verification documents. Images are compressed automatically and linked to your entries.

### Offline-First

Works without internet. Install it on your phone like a native app. Your data persists in local storage.

### Privacy by Design

No accounts. No cloud sync. No analytics that track your personal information. Just a tool that helps you stay organized.

---

## Getting Started

### Requirements

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/naretakis/hourkeep.git
cd hourkeep
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
npm run build
npm start
```

### Deployment

HourKeep deploys to GitHub Pages via GitHub Actions. See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

---

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── onboarding/      # Privacy notice and profile setup
│   ├── how-to-hourkeep/ # Assessment flow
│   ├── tracking/        # Activity and income logging
│   ├── exemptions/      # Exemption screening
│   ├── export/          # Data export
│   └── settings/        # Configuration and profile management
├── components/          # React components organized by feature
├── lib/                 # Business logic, database, utilities
│   ├── storage/         # Dexie database operations
│   ├── exemptions/      # Exemption logic and definitions
│   └── assessment/      # Recommendation engine
├── types/               # TypeScript interfaces
└── theme/               # Material-UI customization
```

---

## Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 16 (App Router) |
| Language   | TypeScript              |
| UI         | Material-UI v7          |
| Storage    | Dexie.js (IndexedDB)    |
| PWA        | next-pwa                |
| Dates      | date-fns                |
| Validation | Zod                     |

---

## Configuration

If you fork this repository, update these files with your own URLs:

**package.json**

```json
{
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/hourkeep.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/hourkeep/issues"
  },
  "homepage": "https://YOUR_USERNAME.github.io/hourkeep"
}
```

**src/config/app.ts**

```typescript
repository: {
  url: "https://github.com/YOUR_USERNAME/hourkeep",
  issuesUrl: "https://github.com/YOUR_USERNAME/hourkeep/issues",
}
```

---

## Usage

### First Time

1. Read and acknowledge the privacy notice
2. Enter basic profile information
3. Take the "How to HourKeep" assessment to get personalized guidance
4. Start tracking (if not exempt)

### Logging Hours

Select a date, choose an activity type (work, volunteer, education), enter hours, and optionally attach documents.

### Logging Income

Enter the amount, select the pay period, and the app calculates your monthly equivalent automatically.

### Exporting Data

Go to Settings and export your records as JSON or plain text for agency submission.

---

## Browser Support

| Browser     | Support              |
| ----------- | -------------------- |
| Chrome/Edge | Full                 |
| Firefox     | Full                 |
| Safari      | Limited PWA features |

---

## Privacy

HourKeep collects anonymous usage statistics (page views, device types, regions) via Plausible Analytics to understand where the tool is needed most. This does not include any personal information, activity logs, or documents.

To opt out, enable "Do Not Track" in your browser settings.

What we collect:

- Page views, device type, browser, screen size, state/region

What we never collect:

- Names, dates of birth, Medicaid IDs
- Activity logs or hours worked
- Documents or images
- IP addresses or cross-site tracking

---

## Documentation

- [CHANGELOG.md](CHANGELOG.md) — Version history
- [ROADMAP.md](ROADMAP.md) — Current and planned features
- [DEPLOYMENT.md](DEPLOYMENT.md) — Deployment instructions
- [BRANDING.md](BRANDING.md) — Brand guidelines
- [PWA-TESTING.md](PWA-TESTING.md) — Testing PWA functionality

---

## Contributing

HourKeep is an open-source project. Feel free to fork, customize, or submit issues.

---

## License

GNU General Public License v3.0

This copyleft license requires that derivative works be distributed under the same license. See [LICENSE](LICENSE) for details.

---

## Support

Questions or issues? [Open an issue on GitHub](https://github.com/naretakis/hourkeep/issues).
