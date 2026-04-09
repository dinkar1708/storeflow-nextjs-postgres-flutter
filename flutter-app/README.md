# StoreFlow (Flutter)

Android / iOS app for the StoreFlow backend (`api-web`). Package **`storeflow`**, bundle id **`com.storeflow.app`**.

## Prerequisites

Flutter (stable) on `PATH`; Android Studio or Xcode as needed. If **`flutter`** fails on macOS: `sudo xcodebuild -license`.

## API client vs env-only

| Change | What to do |
|--------|------------|
| **`api-web`** routes / Swagger / OpenAPI | [README-API-GENERATION.md](./README-API-GENERATION.md) — curl spec + `build_runner`, then **commit** `lib/swagger_api/storeflow_api.json` and `lib/api_generated/` |
| **Only** `.env.dev` / `.env.prod` (`API_BASE_URL`) | From `flutter-app/`: `dart pub get` → `dart run build_runner clean` → `dart run build_runner build --delete-conflicting-outputs` (no Swagger fetch) |

Details: [README-API-GENERATION.md](./README-API-GENERATION.md)

## Base URL (Envied)

- **`.env.dev`** → debug/profile · **`.env.prod`** → release · copy from **`.env.example`**
- After editing env files, run the **`build_runner`** steps in the table above.

**`API_BASE_URL` hints:** Android emulator → `http://10.0.2.2:3001` · iOS simulator → `http://localhost:3001` · physical device → `http://<your-computer-LAN-IP>:3001`

## Run & test

```bash
cd flutter-app
flutter pub get
flutter run              # or: -d android  /  -d ios
```

```bash
flutter test
```

## Layout

`lib/main.dart` — UI · `android/`, `ios/` — platform projects · generated API under `lib/api_generated/`.
