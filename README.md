# CricHeroes Employee Engagement Survey

A modern, mobile-friendly survey application for measuring team engagement and building high-performing organizations.

## 📋 Features

- **12 Engagement Questions** - Based on proven employee engagement metrics
- **Anonymous Responses** - Device fingerprinting for anonymous tracking
- **PDF Export** - Download responses for personal records
- **Google Sheets Integration** - Auto-submit responses to your Google Sheet
- **Resume & Preview** - Users can review and edit their responses
- **Beautiful UI** - Responsive design with CricHeroes branding

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Open browser:**
   ```
   http://localhost:3000
   ```

### Deploy to Vercel

#### Option 1: Via GitHub (Recommended)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CricHeroes Survey"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/cricheroessurvey.git
   git push -u origin main
   ```

2. **Deploy with Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Search for `cricheroessurvey` repository
   - Click "Import"
   - Keep default settings
   - Click "Deploy"

3. **Get live URL:**
   - Vercel will provide a URL like `cricheroessurvey.vercel.app`
   - Share this with your team!

#### Option 2: Direct Deploy

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## 📊 Google Sheets Integration

Your deployment URL is already configured with the Google Apps Script endpoint:

```
https://script.google.com/a/macros/cricheroes.in/s/AKfycbzdfsnssYRkTNmPZHN-u0hWHmwGrFNTf26581o5ADsDNPVDuiggYLFSQ3N5hzL4ac-f/exec
```

**Data Flow:**
1. User completes survey
2. Clicks "Submit to HR"
3. Data automatically saved to Google Sheet
4. Machine ID attached for anonymous tracking

## 📁 Project Structure

```
cricheroessurvey/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx              (Main survey component)
│   ├── index.js             (React entry point)
│   └── index.css            (Global styles)
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔧 Customization

### Add Custom Questions

Edit `src/App.jsx`:

```javascript
const questions = [
  "Your custom question 1?",
  "Your custom question 2?",
  // ... add more questions
];
```

### Change Colors

Edit `tailwind.config.js` to customize teal colors:

```javascript
teal: {
  600: '#your-color-code',
  700: '#your-color-code',
  // ... etc
}
```

### Modify Google Sheet URL

Edit `src/App.jsx` in `submitToGoogleSheets()` function:

```javascript
const googleScriptUrl = 'YOUR_NEW_URL_HERE';
```

## 📱 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🔒 Privacy & Security

- **Anonymous:** Device fingerprint only, no personal data collected
- **Encrypted:** Data transmitted via HTTPS
- **Secure:** Google Sheets with standard authentication
- **Compliant:** No tracking cookies or analytics

## 📞 Support

For issues or questions:
1. Check the console for errors
2. Verify Google Apps Script deployment URL
3. Ensure Google Sheet has correct permissions

## 📄 License

Built for CricHeroes © 2024

---

**Happy Surveying! 🏏**
