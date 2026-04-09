# StoreFlow (Flutter)

Simple Flutter app for **Android** and **iOS**, aligned with the StoreFlow backend (`api-web`).

| Setting | Value |
|--------|--------|
| App name (display) | **StoreFlow** |
| Dart package | `storeflow` |
| Android `applicationId` / namespace | **`com.storeflow.app`** |
| iOS bundle identifier | **`com.storeflow.app`** |

## Prerequisites

- [Flutter](https://docs.flutter.dev/get-started/install) (stable), with `flutter` on your `PATH`
- **Android:** Android Studio / SDK, emulator or device
- **iOS (macOS only):** Xcode, CocoaPods (`sudo gem install cocoapods`), simulator or device  
- On some Macs, Apple requires accepting the Xcode license before **any** `flutter` command will run:

  ```bash
  sudo xcodebuild -license
  ```

## Run

From this directory:

```bash
cd how_to_use_this_repo/flutter-app
flutter pub get
flutter run                    # pick a device when prompted
flutter run -d android         # Android only
flutter run -d ios             # iOS simulator/device (macOS + Xcode)
```

## Tests

```bash
flutter test
```

## Project layout

- `lib/main.dart` — entry UI (Material 3, “StoreFlow” home)
- `android/` — Gradle project (`com.storeflow.app`)
- `ios/` — Xcode workspace (`Runner.xcworkspace`)

If `ios/Podfile` is missing, running `flutter run` on iOS will let Flutter generate/update iOS integration as needed for your Flutter SDK version.
