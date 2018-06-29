import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Usuario } from '../../models/usuario.model';
import { UploadFileService } from '../upload-file/upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  user: Usuario;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private uploadFileService: UploadFileService
  ) {
    this.loadUserData();
  }

  login(usuario: Usuario, recuerdame: boolean = false) {
    return this.http.post(`${this.baseUrl}login`, usuario).pipe(
      map((res: any) => {
        if (recuerdame) {
          localStorage.setItem('email', usuario.email);
        } else {
          localStorage.removeItem('email');
        }

        this.saveUserData(res.id, res.token, res.usuario);
      })
    );
  }

  logout() {
    this.user = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    return this.http.post(`${this.baseUrl}login/google`, { token }).pipe(
      map((res: any) => {
        this.saveUserData(res.id, res.token, res.usuario);
        return true;
      })
    );
  }

  loggedIn() {
    return this.token.length > 5 ? true : false;
  }

  saveUserData(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.user = usuario;
    this.token = token;
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      const user = localStorage.getItem('usuario');
      if (user) {
        this.user = JSON.parse(user);
      }
    } else {
      this.token = '';
      this.user = null;
    }
  }

  createUser(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}usuario`, usuario);
  }

  updateUser(usuario: Usuario): Observable<any> {
    return this.http
      .put<any>(
        `${this.baseUrl}usuario/${usuario._id}?token=${this.token}`,
        usuario
      )
      .pipe(
        map((res: any) => {
          this.saveUserData(res.usuario._id, this.token, res.usuario);
          return res;
        })
      );
  }

  uploadFile(file: File, id: string) {
    return from(this.uploadFileService.uploadFile(file, 'usuarios', id)).pipe(
      map((response: any) => {
        this.user.img = response.usuario.img;
        this.saveUserData(id, this.token, this.user);
        return response;
      })
    );
  }
}
