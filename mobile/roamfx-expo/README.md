# RoamFX Expo Wrapper

This is a lightweight Expo wrapper for the hosted RoamFX PWA.

## Setup

```bash
cd mobile/roamfx-expo
npm install
npx eas-cli@latest init --id e5509c45-1086-46bf-ad7a-39cc89f72f59
```

## Preview Build

```bash
npx eas-cli@latest build --platform all --profile preview
```

## Store Build And Submit

Use this only after Apple and Google Play submission credentials are configured:

```bash
npx eas-cli@latest build --platform all --profile production --auto-submit
```

The app URL is configured through `EXPO_PUBLIC_ROAMFX_URL` in `eas.json`.
