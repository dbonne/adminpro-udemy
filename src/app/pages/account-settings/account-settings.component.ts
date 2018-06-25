import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private _document,
    private _ajustes: SettingsService
  ) {}

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarColor(tema: string, element: any) {
    this.aplicarCheck(element);
    this._ajustes.applyTheme(tema);
  }

  aplicarCheck(element: any) {
    const selectores: any = this._document.getElementsByClassName('selector');
    for (const ref of selectores) {
      ref.classList.remove('working');
    }

    element.classList.add('working');
  }

  colocarCheck(): any {
    const selectores: any = this._document.getElementsByClassName('selector');
    for (const ref of selectores) {
      if (ref.getAttribute('data-theme') === this._ajustes.settings.theme) {
        ref.classList.add('working');
      }
    }
  }
}
