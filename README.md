# QuickStow

A simple web app to track where you put your stuff. Never forget where you stored something again!

### Announcement
🚀 **QuickStow is now live at [quickstow.haolaijiang.com](https://quickstow.haolaijiang.com)!**

## Features

- 📦 **Capture** - Quickly save item locations with a simple form
- 🔍 **Find** - Search for items and see their current location
- 📃 **See All Items** - View a complete list of all your saved items
- 🗑️ **Management** - Delete items and their location history
- ☁️ **Sync** - Sign in with Google to sync across devices
- 📱 **Works Offline** - Data saved locally, syncs when online

## Tech Stack

- TypeScript
- Firebase (Auth + Firestore)
- Vanilla JS (no framework)
- Local Storage for offline support


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
