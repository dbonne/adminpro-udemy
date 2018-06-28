import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from '../../models/usuario.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  user: Usuario;
  token: string;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserData();
  }

  crearUsuario(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}usuario`, usuario);
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
}
