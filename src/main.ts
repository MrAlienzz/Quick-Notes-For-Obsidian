import { App, Notice, Plugin, PluginSettingTab, Setting, TFile } from "obsidian";

interface QuickMeetingNotesSettings {
	folderName: string;
}

const DEFAULT_SETTINGS: QuickMeetingNotesSettings = {
	folderName: "Daily Notes",
};

export default class QuickMeetingNotesPlugin extends Plugin {
	settings: QuickMeetingNotesSettings = DEFAULT_SETTINGS;
	panel: QuickMeetingNotesPanel;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.panel = new QuickMeetingNotesPanel(this.app, this);

		this.addCommand({
			id: "open-quick-note-dialog",
			name: "Open Quick Note Dialog",
			callback: () => {
				void this.panel.open();
			},
		});

		this.addSettingTab(new QuickMeetingNotesSettingTab(this.app, this));
	}

	onunload(): void {
		this.panel.close();
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async saveNote(noteText: string): Promise<void> {
		const folderName = this.settings.folderName.trim() || DEFAULT_SETTINGS.folderName;
		const today = new Date().toISOString().slice(0, 10);
		const filePath = `${folderName}/${today}.md`;

		try {
			const folder = this.app.vault.getAbstractFileByPath(folderName);
			if (!folder) {
				await this.app.vault.createFolder(folderName);
			}

			const existingFile = this.app.vault.getAbstractFileByPath(filePath);
			if (!existingFile) {
				const initialContent = `# Notes — ${today}\n${noteText}\n`;
				await this.app.vault.create(filePath, initialContent);
				return;
			}

			if (existingFile instanceof TFile) {
				await this.app.vault.process(existingFile, (content) => {
					const separator = content.endsWith("\n") ? "" : "\n";
					return `${content}${separator}${noteText}\n`;
				});
			}
		} catch (error) {
			new Notice("Unable to save note.");
			throw error;
		}
	}
}

class QuickMeetingNotesPanel {
	app: App;
	plugin: QuickMeetingNotesPlugin;
	panelEl: HTMLElement | null = null;
	textareaEl: HTMLTextAreaElement | null = null;
	statusEl: HTMLElement | null = null;

	constructor(app: App, plugin: QuickMeetingNotesPlugin) {
		this.app = app;
		this.plugin = plugin;
	}

	async open(): Promise<void> {
		if (this.panelEl && document.body.contains(this.panelEl)) {
			this.textareaEl?.focus();
			return;
		}

		const panelEl = document.createElement("div");
		panelEl.className = "qmn-panel";
		panelEl.style.position = "fixed";
		panelEl.style.zIndex = "99999";
		panelEl.style.width = "320px";

		const storedPosition = localStorage.getItem("qmn-panel-position");
		let top = "20px";
		let left = "20px";
		if (storedPosition) {
			try {
				const parsed = JSON.parse(storedPosition) as { top?: string; left?: string };
				top = parsed.top ?? top;
				left = parsed.left ?? left;
			} catch {
				// Ignore invalid localStorage values and keep defaults.
			}
		}
		panelEl.style.top = top;
		panelEl.style.left = left;
		document.body.appendChild(panelEl);
		this.panelEl = panelEl;

		const titlebarEl = document.createElement("div");
		titlebarEl.className = "qmn-titlebar";
		panelEl.appendChild(titlebarEl);

		const defaultDateTitle = new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		const titleEl = document.createElement("span");
		titleEl.className = "qmn-title";
		titleEl.setAttribute("contenteditable", "true");
		titleEl.textContent = defaultDateTitle;
		titlebarEl.appendChild(titleEl);

		const closeButtonEl = document.createElement("button");
		closeButtonEl.className = "qmn-close";
		closeButtonEl.type = "button";
		closeButtonEl.textContent = "×";
		closeButtonEl.addEventListener("click", () => this.close());
		titlebarEl.appendChild(closeButtonEl);

		titleEl.addEventListener("mousedown", (event) => event.stopPropagation());
		closeButtonEl.addEventListener("mousedown", (event) => event.stopPropagation());

		const panelBodyEl = document.createElement("div");
		panelBodyEl.className = "qmn-panel-body";
		panelEl.appendChild(panelBodyEl);

		const textareaEl = document.createElement("textarea");
		textareaEl.className = "qmn-textarea";
		textareaEl.placeholder = "Type your note...";
		panelBodyEl.appendChild(textareaEl);
		this.textareaEl = textareaEl;

		const statusEl = document.createElement("div");
		statusEl.className = "qmn-status";
		statusEl.textContent = "✓ Saved";
		panelBodyEl.appendChild(statusEl);
		this.statusEl = statusEl;

		textareaEl.addEventListener("keydown", async (event) => {
			if (event.key === "Escape") {
				this.close();
				return;
			}

			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();

				const noteText = textareaEl.value.trim();
				if (!noteText) {
					return;
				}

				const currentTitle = titleEl.textContent?.trim() ?? "";
				const finalText =
					currentTitle && currentTitle !== defaultDateTitle
						? `[${currentTitle}] ${noteText}`
						: noteText;

				await this.plugin.saveNote(finalText);
				textareaEl.value = "";
				this.showStatus();
			}
		});

		let isDragging = false;
		let dragOffsetX = 0;
		let dragOffsetY = 0;

		titlebarEl.addEventListener("mousedown", (event: MouseEvent) => {
			if (!this.panelEl) {
				return;
			}

			const rect = this.panelEl.getBoundingClientRect();
			dragOffsetX = event.clientX - rect.left;
			dragOffsetY = event.clientY - rect.top;
			isDragging = true;

			const onMouseMove = (moveEvent: MouseEvent): void => {
				if (!isDragging || !this.panelEl) {
					return;
				}

				this.panelEl.style.left = `${moveEvent.clientX - dragOffsetX}px`;
				this.panelEl.style.top = `${moveEvent.clientY - dragOffsetY}px`;
			};

			const onMouseUp = (): void => {
				isDragging = false;
				if (this.panelEl) {
					const panelRect = this.panelEl.getBoundingClientRect();
					localStorage.setItem(
						"qmn-panel-position",
						JSON.stringify({ top: `${panelRect.top}px`, left: `${panelRect.left}px` })
					);
				}
				document.removeEventListener("mousemove", onMouseMove);
				document.removeEventListener("mouseup", onMouseUp);
			};

			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);
		});

		textareaEl.focus();
	}

	showStatus(): void {
		if (!this.statusEl) {
			return;
		}

		this.statusEl.style.opacity = "1";
		window.setTimeout(() => {
			if (this.statusEl) {
				this.statusEl.style.opacity = "0";
			}
		}, 600);
	}

	close(): void {
		if (this.panelEl && this.panelEl.parentElement) {
			this.panelEl.parentElement.removeChild(this.panelEl);
		}
		this.panelEl = null;
		this.textareaEl = null;
		this.statusEl = null;
	}
}

class QuickMeetingNotesSettingTab extends PluginSettingTab {
	plugin: QuickMeetingNotesPlugin;

	constructor(app: App, plugin: QuickMeetingNotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Quick Meeting Notes Settings" });

		new Setting(containerEl)
			.setName("Notes Folder")
			.setDesc("Folder inside your vault where daily note files are saved.")
			.addText((text) =>
				text.setPlaceholder("Daily Notes").setValue(this.plugin.settings.folderName).onChange(async (value) => {
					this.plugin.settings.folderName = value.trim() || "Daily Notes";
					await this.plugin.saveSettings();
				})
			);

		containerEl.createEl("div", {
			cls: "qmn-settings-note",
			text: 'To change the hotkey: go to Settings → Hotkeys and search "Quick Meeting Notes".',
		});

		containerEl.createEl("div", {
			cls: "qmn-settings-note",
			text: "For a global hotkey that works while Zoom is open, use AutoHotkey. See README.md for full setup instructions.",
		});
	}
}
