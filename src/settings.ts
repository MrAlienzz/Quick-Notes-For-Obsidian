import { App, PluginSettingTab, Setting } from "obsidian";
import MyPlugin from "./main";

export interface QuickMeetingNotesSettings {
	folderName: string;
}

export const DEFAULT_SETTINGS: QuickMeetingNotesSettings = {
	folderName: "Daily Notes",
};

export class QuickMeetingNotesSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
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
				text
				.setPlaceholder("Daily Notes")
				.setValue(this.plugin.settings.folderName)
				.onChange(async (value) => {
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
