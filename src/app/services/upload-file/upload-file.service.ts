import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  constructor() {}

  uploadFile(file: File, tipo: string, id: string) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('imagen', file, file.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            console.log('Imagen subida');
            reject(xhr.response);
          }
        }
      };

      const baseUrl = `${environment.apiUrl}upload/${tipo}/${id}`;
      xhr.open('PUT', baseUrl, true);
      xhr.send(formData);
    });
  }
}
