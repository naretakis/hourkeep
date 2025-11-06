# Application Configuration

This document explains how HourKeep's configuration works and how to customize it for your deployment.

## Version Management

The app version is managed in a single place: `package.json`

```json
{
  "version": "4.1.0"
}
```

This version is automatically:

- Injected into the Next.js build via `next.config.ts`
- Available as `process.env.NEXT_PUBLIC_APP_VERSION`
- Displayed in the Settings page About section
- Used in the PWA manifest

### Updating the Version

Simply update the version in `package.json`:

```bash
npm version patch  # 4.1.0 -> 4.1.1
npm version minor  # 4.1.0 -> 4.2.0
npm version major  # 4.1.0 -> 5.0.0
```

The new version will automatically appear throughout the app on the next build.

## Repository URLs

Repository URLs are configured in two places:

### 1. package.json

Standard npm package fields for tooling and npm registry:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/hourkeep.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/hourkeep/issues"
  },
  "homepage": "https://github.com/yourusername/hourkeep#readme"
}
```

### 2. src/config/app.ts

Application-specific configuration used in the UI:

```typescript
export const APP_CONFIG = {
  name: "HourKeep",
  version: process.env.NEXT_PUBLIC_APP_VERSION || "4.1.0",
  repository: {
    url: "https://github.com/yourusername/hourkeep",
    issuesUrl: "https://github.com/yourusername/hourkeep/issues",
  },
  license: "GPL-3.0-or-later",
  description:
    "Track work, volunteer, and education hours to meet Medicaid work requirements",
} as const;
```

### Why Two Places?

- **package.json**: Used by npm, GitHub, and development tools
- **src/config/app.ts**: Used by the application UI (Settings page, About section)

When forking the repository, update both to ensure consistency.

## App Configuration File

The `src/config/app.ts` file is the central place for app-wide constants:

```typescript
import { APP_CONFIG } from "@/config/app";

// Use in components
<Typography>Version {APP_CONFIG.version}</Typography>
<Button href={APP_CONFIG.repository.url}>View on GitHub</Button>
```

### Available Configuration

- `APP_CONFIG.name` - Application name
- `APP_CONFIG.version` - Current version (from package.json)
- `APP_CONFIG.repository.url` - GitHub repository URL
- `APP_CONFIG.repository.issuesUrl` - GitHub issues URL
- `APP_CONFIG.license` - License identifier
- `APP_CONFIG.description` - Short app description

## Environment Variables

HourKeep uses Next.js environment variables for build-time configuration:

### NEXT_PUBLIC_APP_VERSION

Automatically injected by `next.config.ts` from `package.json`:

```typescript
// next.config.ts
const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8"),
);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};
```

Available in all components:

```typescript
const version = process.env.NEXT_PUBLIC_APP_VERSION;
```

## Forking Checklist

When forking HourKeep for your own deployment:

- [ ] Update `package.json` repository URLs
- [ ] Update `src/config/app.ts` repository URLs
- [ ] Update `README.md` clone URL
- [ ] Update `next.config.ts` basePath (if deploying to a different path)
- [ ] Update GitHub Pages deployment settings (see DEPLOYMENT.md)

## Adding New Configuration

To add new app-wide configuration:

1. Add it to `src/config/app.ts`:

   ```typescript
   export const APP_CONFIG = {
     // ... existing config
     newSetting: "value",
   } as const;
   ```

2. Import and use it:

   ```typescript
   import { APP_CONFIG } from "@/config/app";

   console.log(APP_CONFIG.newSetting);
   ```

3. For environment-specific values, use Next.js environment variables:
   ```typescript
   // next.config.ts
   env: {
     NEXT_PUBLIC_MY_SETTING: process.env.MY_SETTING || "default",
   }
   ```

## Best Practices

1. **Single Source of Truth**: Keep version in `package.json` only
2. **Type Safety**: Use `as const` in config objects for better TypeScript inference
3. **Public Variables**: Prefix with `NEXT_PUBLIC_` for client-side access
4. **Documentation**: Update this file when adding new configuration
5. **Validation**: Consider adding runtime validation for critical config values

## Related Files

- `package.json` - Version and repository metadata
- `src/config/app.ts` - Application configuration
- `next.config.ts` - Next.js build configuration
- `src/app/settings/page.tsx` - Settings page (displays version and links)
