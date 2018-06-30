import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UserService } from '../../services/user/user.service';
import { UploadFileService } from '../../services/upload-file/upload-file.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  file: File;
  tempFile: string;

  constructor(
    private uploadFileService: UploadFileService,
    public modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {}

  closeModal() {
    this.tempFile = null;
    this.file = null;

    this.modalUploadService.hideModal();
  }

  selectImage(selectedFile: File) {
    if (!selectedFile) {
      this.file = null;
      return;
    }

    if (selectedFile.type.indexOf('image') < 0) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.selectImage = null;
      return;
    }

    this.file = selectedFile;

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onloadend = () => (this.tempFile = reader.result);
  }

  uploadImage() {
    this.uploadFileService
      .uploadFile(
        this.file,
        this.modalUploadService.type,
        this.modalUploadService.id
      )
      .then(res => {
        this.modalUploadService.notification.emit(res);
        this.closeModal();
      })
      .catch(_ => console.log('Error en la carga'));
  }
}
