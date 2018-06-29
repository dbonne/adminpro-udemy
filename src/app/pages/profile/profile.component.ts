import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';

import { Usuario } from '../../models/usuario.model';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  user: Usuario;
  file: File;
  tempFile: string;

  constructor(private userService: UserService) {
    this.user = userService.user;
  }

  ngOnInit() {}

  update(user: Usuario) {
    this.user.nombre = user.nombre;
    if (this.user.google) {
      this.user.email = user.email;
    }
    this.userService.updateUser(this.user).subscribe(
      response => {
        swal('Usuario actualizado', user.nombre, 'success');
      },
      err => console.log(err)
    );
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

  updateImage() {
    this.userService
      .uploadFile(this.file, this.user._id)
      .subscribe(() => swal('Imagen actualizada', this.user.nombre, 'success'));
  }
}
