# 📝 Quick Meeting Notes

A lightweight Obsidian plugin that lets you capture notes instantly during Zoom calls or any meeting — without ever leaving your workflow.

Press a hotkey → a floating panel appears → type your note → hit Enter. That's it.

---

![Screenshot](Screenshot.png)

---

## ✨ Features

- **Floating Draggable Panel** — Stays on top of your screen, drag it anywhere you want
- **Persistent Position** — Remembers exactly where you left the panel last time
- **Editable Title** — Click the bold date title to rename it (e.g. type "Standup Call")
- **Smart Saving** — If you rename the title, notes are saved as `[Standup Call] your note`
- **Daily Files** — One `.md` file per day, auto-created inside your `Daily Notes` folder
- **Never Loses Data** — Notes are always appended, nothing is ever overwritten or deleted
- **Multi-line Support** — Use `Shift + Enter` to write longer notes before saving
- **Save Confirmation** — A subtle `✓ Saved` message confirms each note was written

---

## 📦 Installation

### Option 1 — From Community Store (Recommended)
1. Open Obsidian → **Settings → Community Plugins**
2. If prompted, click **Turn on Community Plugins**
3. Search for `quick-notes` and Just Download from there (If Available or use Option 2)

### Option 2 — Manual Install

1. Download the latest release from the Releases page
2. Download these 3 files from the release assets:
   - `main.js`
   - `manifest.json`
   - `styles.css`
3. Open File Explorer and navigate to your Obsidian vault folder
4. Enable hidden folders: **View → Show → Hidden Items**
5. Navigate to `.obsidian → plugins`
6. Create a new folder called `quick-notes`
7. Copy the 3 downloaded files into that folder
8. Open Obsidian → **Settings → Community Plugins**
9. If prompted, click **Turn on Community Plugins**
10. Find **Quick Meeting Notes** in the list and toggle it **ON**

---

## ⌨️ Setting Up Your Hotkey

1. Open Obsidian → **Settings → Hotkeys**
2. Search for `Quick Meeting Notes`
3. Click the `+` button next to **Open Quick Note Dialog**
4. Press your preferred key combination (e.g. `Ctrl + Shift + M`)

---

---

##  How to Use

| Action | What Happens |
|--------|-------------|
| Press hotkey | Floating panel opens |
| Type your note + `Enter` | Note saved, input clears, panel stays open |
| `Shift + Enter` | New line inside the note (does not save) |
| Click the bold title | Rename it (e.g. "Weekly Standup") |
| Drag the title bar | Move the panel anywhere on screen |
| Press `×` or `Escape` | Close the panel |
| Press hotkey again (panel open) | Just focuses the input — no duplicate panels |

---

## 📁 Where Are My Notes Saved?

All notes are saved inside your vault in this structure:

```
YourVault/
└── Daily Notes/
    ├── 2026-04-15.md
    ├── 2026-04-16.md
    └── ...
```

Each file starts with a heading and all your notes for that day are listed below it:

```markdown
# Notes — 2026-04-16

First note of the day
Second note here
[Standup Call] Discussed Q2 roadmap
[Standup Call] Action item: send report by Friday
```

> The folder name `Daily Notes` can be changed in plugin settings.

---

## ⚙️ Settings

Go to **Settings → Quick Meeting Notes** to configure:

| Setting | Default | Description |
|---------|---------|-------------|
| Notes Folder | `Daily Notes` | The folder inside your vault where files are saved |

---

## 🛠️ Building From Source

If you want to build the plugin yourself:

```bash
# 1. Clone the repository
git clone https://github.com/YOURUSERNAME/quick-meeting-notes.git

# 2. Enter the folder
cd quick-meeting-notes

# 3. Install dependencies
npm install

# 4. Build the plugin
npm run build
```

Then copy `main.js`, `manifest.json`, and `styles.css` into your vault's plugin folder as described in the installation steps above.

---

## 📋 Changelog

### v1.0.0
- Replaced Modal with custom floating draggable panel
- Added editable bold title with today's date as default
- Added position memory across sessions
- Added meeting name prefixing in saved notes
- Multi-line textarea with Shift+Enter support

### v1.0.0
- Initial release with basic hotkey modal and daily file saving

---

## 📄 License

Licensed under the [Apache 2.0 License](LICENSE).
