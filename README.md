# QuickStow

> Never forget where you put your things again!

A simple, voice-powered web application that helps you record and remember where you've placed important items. Just tap, speak, and save - it's that easy.

## The Problem

We've all been there - you put something important away for safekeeping, and months later, you have no idea where it is. Searching for these items is frustrating and time-consuming.

## The Solution

**QuickStow** provides a magical, minimal-effort way to:
- **Record** where you put items with a single tap and voice command
- **Find** items later with minimal effort
- **Track** location history with timestamps

## Features

- **Voice Recording**: Tap the button to start/stop recording your voice
- **Real-time Transcription**: Automatically converts speech to text using AI
- **Smart Saving**: Intelligently processes and saves your location data
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Audio Visualization**: Real-time visual feedback while recording
- **Secure**: API key stored locally in your browser

## Tech Stack

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks!)
- **Audio Processing**: Web Audio API with AudioWorklet
- **AI Services**: 
  - Speech-to-text transcription
  - Natural language processing for smart summaries
- **Design**: Modern glassmorphism with Inter font family

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Microphone access
- API key from [AI Builders Space](https://space.ai-builders.com)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/QuickStow.git
   cd QuickStow
   ```

2. **Serve the application**
   
   You can use any local web server. Here are a few options:
   
   **Python 3:**
   ```bash
   python3 -m http.server 8080
   ```
   
   **Node.js (http-server):**
   ```bash
   npx http-server -p 8080
   ```
   
   **VS Code Live Server:**
   - Install the Live Server extension
   - Right-click `index.html` and select "Open with Live Server"

3. **Open in browser**
   
   Navigate to `http://localhost:8080`

4. **Add your API key**
   
   - Click the API key input in the top-right corner
   - Enter your API key from AI Builders Space
   - The key will be saved in your browser's local storage

5. **Start recording!**
   
   - Click the "Record Location" button
   - Speak your location (e.g., "I put the passport in the top drawer of my bedroom dresser")
   - Click "Stop Recording"
   - See your transcription and confirmation!

## Usage Examples

**Recording locations:**
- "I put the spare house keys in the blue ceramic bowl on the kitchen counter"
- "The tax documents are in the filing cabinet, second drawer from the top"
- "Winter coat is stored in the hall closet on the top shelf"

**Asking questions:**
- "Where did I put my passport?"
- "Where are the spare batteries?"

## Design Philosophy

The app follows these key principles:

1. **Minimal Effort**: One tap to record, one tap to stop
2. **Visual Feedback**: Clear animations and status indicators
3. **Premium Feel**: Modern design with smooth interactions
4. **Privacy First**: API key stored locally, no unnecessary data collection

## Security & Privacy

- API keys are stored only in your browser's local storage
- Audio is processed in real-time and not stored on the client
- All communication with the API uses secure HTTPS

## Roadmap

- [ ] Search functionality to find previously recorded items
- [ ] History view showing all recorded locations
- [ ] Export/import data functionality
- [ ] Mobile app version
- [ ] Offline support with local storage
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for people who forget where they stow things
- Powered by AI Builders Space API
- Inspired by the universal frustration of losing track of important items

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [project documentation](project-intro.md)

---

**Made by someone who constantly loses their keys**
