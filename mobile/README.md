# RoamFX Mobile Path

The investor demo should launch first as the hosted RoamFX PWA. It is installable on Android and iOS and keeps one shared backend, one compliance flow, and one public URL.

## Phase 1: PWA Demo

Deploy the existing Next.js frontend and Spring Boot backend through the Render Blueprint.

Demo URL after Render deployment:

```text
https://roamfx-frontend.onrender.com
```

Android install:

1. Open the URL in Chrome.
2. Tap the install banner or browser menu.
3. Choose Add to Home screen or Install app.

iOS install:

1. Open the URL in Safari.
2. Tap Share.
3. Choose Add to Home Screen.

## Phase 2: Expo Wrapper

Use Expo when you need installable Android/iOS beta builds outside the browser. The simplest first native shell is a WebView wrapper around the deployed PWA URL.

You created this Expo project:

```bash
npx eas-cli@latest init --id e5509c45-1086-46bf-ad7a-39cc89f72f59
```

Recommended build command after the PWA URL is live and app-store credentials are ready:

```bash
npx eas-cli@latest build --platform all
```

Use `--auto-submit` only after Apple App Store Connect and Google Play credentials are configured:

```bash
npx eas-cli@latest build --platform all --auto-submit
```

Notes:

- iOS installable beta distribution generally requires Apple Developer Program access.
- Android APK/AAB demos are easier to distribute for early investor testing.
- Keep all forex transactions inside the verified authorised partner flow. Do not add native peer-to-peer exchange or meetup screens.
