import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HospitalService } from '../services/hospital/hospital.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalesListResolver implements Resolve<any> {
  constructor(private hospitalServise: HospitalService) {}

  resolve(): Observable<any> {
    return this.hospitalServise
      .findAll()
      .pipe(
        catchError(err =>
          swal(
            'Error cargando datos',
            `No se pudo cargar la lista de hospitales`,
            'error'
          )
        )
      );
  }
}
