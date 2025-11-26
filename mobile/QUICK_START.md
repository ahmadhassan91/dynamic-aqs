# Mobile App Quick Start

**Get the app running in 5 minutes!**

---

## Option 1: Physical Device (RECOMMENDED for Demo)

### iPhone or Android Phone

1. **Install Expo Go App:**
   - iPhone: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the Development Server:**
   ```bash
   cd /Users/clustox_1/Documents/Currie/dynamic-aqs-crm/mobile
   npm install
   npm start
   ```

3. **Connect Your Phone:**
   - **iPhone:** Open Camera app, scan QR code from terminal
   - **Android:** Open Expo Go app, scan QR code from terminal
   - **Important:** Phone must be on same WiFi as computer

4. **App Loads:**
   - Takes ~10 seconds first time
   - Reloads instantly on code changes
   - Shake phone for developer menu

---

## Option 2: iOS Simulator (Mac Only)

```bash
cd /Users/clustox_1/Documents/Currie/dynamic-aqs-crm/mobile
npm install
npm start

# Then press 'i' in the terminal
# Simulator will launch automatically
```

**Requirements:**
- Xcode installed (free from App Store)
- macOS only

---

## Option 3: Android Emulator

```bash
cd /Users/clustox_1/Documents/Currie/dynamic-aqs-crm/mobile
npm install
npm start

# Then press 'a' in the terminal
# Emulator will launch automatically
```

**Requirements:**
- Android Studio installed
- Android emulator configured

---

## Troubleshooting

### "Command not found: npm"

Install Node.js first:
```bash
# Using Homebrew (Mac)
brew install node

# Or download from https://nodejs.org
```

### "Port 8081 already in use"

Another Metro bundler is running:
```bash
# Kill existing process
killall node
npm start
```

### "Unable to resolve module"

Clear cache and reinstall:
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### QR Code Won't Scan

1. Ensure phone and computer on same WiFi
2. Try typing the URL manually (shown in terminal)
3. Use tunnel mode: `npm start -- --tunnel`

---

## Development Workflow

### Hot Reload

- **Fast Refresh:** Saves file = instant reload
- **No restart needed** for most changes
- Shake phone → "Reload" if needed

### Developer Menu

- **iOS:** Cmd+D (simulator) or shake (device)
- **Android:** Cmd+M (emulator) or shake (device)

Options:
- Reload
- Debug Remote JS
- Show Inspector
- Toggle Performance Monitor

### Recommended VS Code Extensions

```bash
code --install-extension msjsdiag.vscode-react-native
code --install-extension mgmcdermott.vscode-language-babel
code --install-extension esbenp.prettier-vscode
```

---

## File Structure

```
mobile/
├── App.tsx                 # Entry point
├── src/
│   ├── screens/
│   │   ├── dashboard/      # ⭐ Dashboard screen (NEW)
│   │   ├── training/       # ⭐ Training management (NEW)
│   │   ├── activities/     # ⭐ Activity logging (NEW)
│   │   ├── customers/      # Customer screens
│   │   ├── map/            # Map screen
│   │   ├── route/          # Route planning
│   │   └── profile/        # Profile screen
│   ├── navigation/         # Navigation config
│   ├── contexts/           # State management
│   └── services/           # API services
└── package.json
```

---

## Quick Commands

```bash
# Start development server
npm start

# Start with cache clear
npm start -- --clear

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run linter
npm run lint

# Run tests
npm test
```

---

## Demo Mode

### Mock Data

All screens use **realistic mock data**:
- Dashboard shows 125 customers, 12 trainings
- Training list shows 3 upcoming, 2 completed
- Activities shows 3 recent entries
- Customer list shows 10+ customers

### Voice Notes

Voice recording is **simulated** for demo:
- Press "Use Voice Note"
- After 3 seconds, auto-fills sample text
- Real implementation uses `expo-speech`

### Login

Demo uses **auto-login**:
- No actual authentication required
- Can implement real login later
- To enable login screen, edit `App.tsx`

---

## For the Meeting

### Best Demo Setup

1. **Use Physical iPhone/Android** (most impressive)
2. **Have backup simulator** ready (in case WiFi issues)
3. **Pre-load app** before meeting starts
4. **Test voice notes** ahead of time
5. **Have DEMO_GUIDE.md** open for script

### Demo Flow (10 minutes)

1. **Dashboard** - Show KPIs and quick actions (2 min)
2. **Training** - Mark complete with voice note (4 min) ⭐
3. **Activities** - Log visit with voice note (3 min) ⭐
4. **Customers** - Show integration (1 min)

---

## Production Build (Future)

When ready for TestFlight/Play Store:

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

Requires Expo EAS account (free tier available).

---

## Support

- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Troubleshooting:** Check `DEMO_GUIDE.md`

---

**Ready to demo? Run `npm start` and scan QR code!** 📱
