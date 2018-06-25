import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings: Settings = {
    themeUrl: 'assets/css/colors/default.css',
    theme: 'default'
  };

  constructor(@Inject(DOCUMENT) private _document) {
    this.loadSettings();
    this.applyTheme(this.settings.theme);
  }

  saveSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  loadSettings() {
    const settings = localStorage.getItem('settings');
    if (settings) {
      console.log('Loading local storage settings.');
      this.settings = JSON.parse(settings);
    } else {
      console.log('Using default values.');
    }
  }

  applyTheme(theme: string) {
    this.settings.theme = theme;
    this.settings.themeUrl = `assets/css/colors/${theme}.css`;

    this._document
      .getElementById('tema')
      .setAttribute('href', this.settings.themeUrl);

    this.saveSettings();
  }
}

interface Settings {
  themeUrl: string;
  theme: string;
}
