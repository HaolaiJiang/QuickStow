# QuickStow

A simple web app to track where you put your stuff. Never forget where you stored something again!

## Features

- 📦 **Capture** - Quickly save item locations with a simple form
- 🔍 **Find** - Search for items and see their current location
- ☁️ **Sync** - Sign in with Google to sync across devices
- 📱 **Works Offline** - Data saved locally, syncs when online

## Tech Stack

- TypeScript
- Firebase (Auth + Firestore)
- Vanilla JS (no framework)
- Local Storage for offline support

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run local server
python3 -m http.server 3000
# or
npx serve
```

Open http://localhost:3000

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. No build settings needed (static site)
4. Add custom domain: `quickstow.yourdomain.com`

### Firebase Setup

1. Create project at [Firebase Console](https://console.firebase.google.com)
2. Enable Google Sign-In (Authentication → Sign-in method)
3. Create Firestore database
4. Add your domain to authorized domains (Authentication → Settings)
5. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Project Structure

```
QuickStow/
├── index.html          # Main HTML file
├── src/
│   ├── app.ts          # Main application logic
│   ├── storage.ts      # LocalStorage service
│   ├── auth.ts         # Firebase Auth service
│   ├── sync.ts         # Firestore sync service
│   ├── firebase-config.ts
│   └── types.ts        # TypeScript interfaces
├── dist/               # Compiled JavaScript
└── firestore.rules     # Firestore security rules
```

## License

MIT
