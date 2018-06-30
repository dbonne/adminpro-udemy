import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BusquedaUsuarios } from '../models/busquedaUsuarios.model';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserListResolver implements Resolve<BusquedaUsuarios> {
  constructor(private userService: UserService, private router: Router) {}

  resolve(): Observable<BusquedaUsuarios> {
    return this.userService
      .loadAll()
      .pipe(
        catchError(err =>
          swal(
            'Error cargando datos',
            `No se pudo cargar la lista de usuarios`,
            'success'
          )
        )
      );
  }
}
