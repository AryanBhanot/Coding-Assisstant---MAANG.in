# Extensional Crisis

**Version:** 0.3  
**Author:** First Last  

## Description
Because you totally needed another Chrome extension in your life. Extensional Crisis adds AI-powered chaos to Maang Problems by injecting an interactive AI chatbot into problem pages.

## Features
- **Prompt Injection:** Automatically constructs a prompt using problem details scraped from the Maang Problems page.
- **Explain Like I'm 5 Option:** Quickly toggle a simplified explanation mode.
- **Chat Storage:** Conversation history is saved locally.
- **API Key Management:** Set and clear your API key via the extension popup.
- **Floating Chat Button:** Easily accessible button to activate the chatbot.

## Files
- `manifest.json` – Configuration and permissions for the extension.
- `background.js` – Background service worker.
- `content.js` – Injects the main helper script into problem pages.
- `helper.js` – Contains the chatbot interface logic and prompt generation.
- `popup.html` & `popup.js` – For API key management.
- `options.html` – Options page for future settings.
- `styles.css` – Styling for the chatbot UI.
- `assets/ext-icon.png` – Extension icon (please add your own image).
