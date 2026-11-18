# Password Strength Checker

A small website that rates a password as Weak, Medium or Strong as you type.

## Run it in VS Code

**Option A: just open it**
1. In VS Code: File > Open Folder > choose `password-strength-checker`.
2. Right-click `index.html` in the Explorer and choose "Reveal in File Explorer" (or "Open in Default Browser").
3. Double-click `index.html`. It opens in your browser.

**Option B: Live Server (auto-refresh on save)**
1. Install the "Live Server" extension by Ritwick Dey.
2. Right-click `index.html` > "Open with Live Server".

No installs, no build step, no internet needed.

## Project structure

```
password-strength-checker/
├── index.html      page structure
├── css/
│   └── style.css   all styling
├── js/
│   └── script.js   strength logic + meter updates
└── README.md
```

## How the score works

Each check earns 1 point (max 6):
8+ characters, 12+ characters, lowercase, uppercase, number, special character.

- 0 to 3 points: Weak
- 4 to 5 points: Medium
- 6 points: Strong

Adjustments: 3+ repeated characters in a row costs 1 point, and a short list of very common passwords is always Weak.
