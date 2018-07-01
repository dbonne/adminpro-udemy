import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Medico } from '../../models/medico.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  baseUrl = environment.apiUrl;
  total = 0;

  constructor(public http: HttpClient, private userService: UserService) {}

  loadAll(start: number = 0) {
    let url = `${this.baseUrl}medico`;
    if (start > 0) {
      url += `?desde=${start}`;
    }
    return this.http.get(`${url}`).pipe(
      map((res: any) => {
        this.total = res.total;
        return res;
      })
    );
  }

  findById(id: string): Observable<Medico> {
    return this.http.get<Medico>(
      `${this.baseUrl}medico/${id}?token=${this.userService.token}`
    );
  }

  search(term: string): Observable<any> {
    return this.http.get(`${this.baseUrl}busqueda/coleccion/medicos/${term}`).pipe(
      delay(500),
      map(res => {
        return res;
      })
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}medico/${id}?token=${this.userService.token}`
    );
  }

  createOrUpdate(medico: Medico) {
    if (medico._id) {
      // actualizar
      return this.http.put(
        `${this.baseUrl}medico/${medico._id}?token=${this.userService.token}`,
        medico
      );
    }
    return this.http.post(
      `${this.baseUrl}medico?token=${this.userService.token}`,
      medico
    );
  }
}
