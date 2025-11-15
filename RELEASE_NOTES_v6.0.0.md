# HourKeep v6.0.0 Release Notes

**Release Date:** November 14, 2025

## Find Your Path Assessment

A guided assessment that helps you discover the easiest way to maintain your Medicaid coverage. Answer simple questions about your situation and get a personalized recommendation.

### What's New

**Guided Assessment**

- Combined exemption screening with work situation analysis
- Personalized recommendations for your easiest compliance path
- Four possible outcomes: exemption, income tracking, seasonal income, or hour tracking
- Progress saving to resume incomplete assessments
- Assessment history to track changes over time

**Dashboard Integration**

- New assessment badge showing your status and recommendation
- Quick access to results and reasoning
- Easy re-assessment when circumstances change

**Technical**

- 3 new database tables (v6 migration happens automatically)
- 12 new components (~3,400 lines)
- Smart recommendation engine with deterministic logic

### Changes

- Standalone exemption screening now integrated into Find Your Path
- Exemption badge replaced with comprehensive assessment badge
- Exemption page redirects to new assessment flow

### Getting Started

**New users:** Take the assessment after onboarding (or skip for now)

**Existing users:** Look for the assessment badge on your dashboard and tap "Take Assessment"

Your existing data is preserved. Database migration happens automatically.

---

See [CHANGELOG.md](CHANGELOG.md) for complete details.
