import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {
  type: string;
  id: string;

  public hiden = 'hide';
  notification = new EventEmitter<any>();

  constructor() {}

  hideModal() {
    this.hiden = 'hide';
    this.id = null;
    this.type = null;
  }

  showModal(type: string, id: string) {
    this.hiden = '';
    this.id = id;
    this.type = type;
  }
}
