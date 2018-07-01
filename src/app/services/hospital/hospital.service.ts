import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { Hospital } from '../../models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) {}

  findAll() {
    return this.http.get(`${this.baseUrl}hospital`);
  }

  findById(id: string): Observable<Hospital> {
    return this.http.get<Hospital>(
      `${this.baseUrl}hospital/${id}?token=${this.userService.token}`
    );
  }

  search(term: string): Observable<any> {
    return this.http.get(`${this.baseUrl}busqueda/coleccion/hospitales/${term}`);
  }

  loadAll(start: number = 0): any {
    let url = `${this.baseUrl}hospital`;
    if (start > 0) {
      url += `?desde=${start}`;
    }
    return this.http.get(`${url}`);
  }

  create(name: string): any {
    return this.http.post(
      `${this.baseUrl}hospital?token=${this.userService.token}`,
      { nombre: name }
    );
  }

  delete(id: string): any {
    return this.http.delete(
      `${this.baseUrl}hospital/${id}?token=${this.userService.token}`
    );
  }

  update(hospital): any {
    return this.http.put(
      `${this.baseUrl}hospital/${hospital._id}?token=${this.userService.token}`,
      hospital
    );
  }
}
