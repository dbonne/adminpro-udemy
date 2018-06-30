import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Subject } from 'rxjs';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  loading = false;
  hospitales;
  total = 0;
  from = 0;
  termsSubject: Subject<string> = new Subject<string>();

  constructor(
    private hospitalesService: HospitalService,
    private route: ActivatedRoute,
    private modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.hospitales = data['busqueda'].hospitales;
      this.total = data['busqueda'].total;
    });

    this.termsSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(value => value.length > 3 || value.length === 0)
      )
      .subscribe(res => {
        this.doSearch(res);
      });

    this.modalUploadService.notification.subscribe(() => this.loadHospitales());
  }

  search(term: string) {
    this.termsSubject.next(term);
  }

  doSearch(term: string): any {
    if (term) {
      this.loading = true;
      this.hospitalesService.search(term).subscribe(data => {
        this.hospitales = data.hospitales;
        this.loading = false;
      });
    } else {
      this.loadHospitales();
    }
  }

  nextPage(from: number) {
    if (this.from + from < 0) {
      return;
    } else if (this.from + from >= this.total) {
      return;
    } else {
      this.from += from;
    }
    this.loadHospitales();
  }

  loadHospitales() {
    this.loading = true;
    this.hospitalesService.loadAll(this.from).subscribe(res => {
      this.total = res.total;
      this.hospitales = res.hospitales;
      this.loading = false;
    });
  }

  newHospital() {
    swal({
      title: 'Crear un hospital',
      icon: 'info',
      content: {
        element: 'input'
      },
      buttons: ['Cancelar', 'Crear'],
      dangerMode: true
    }).then(value => {
      this.hospitalesService.create(value).subscribe(res => {
        swal(
          'Hospital creado',
          `El hospital se ha creado correctamente.`,
          'success'
        ).then(() => this.loadHospitales());
      });
    });
  }

  deleteHospital(hospital: any) {
    swal({
      title: '¿Está seguro?',
      text: `Está a punto de borrar el hospital ${hospital.nombre}`,
      icon: 'warning',
      buttons: ['Cancelar', 'Eliminar'],
      dangerMode: true
    }).then(res => {
      if (res) {
        this.hospitalesService.delete(hospital._id).subscribe(() => {
          swal(
            'Hospital eliminado',
            `El hospital ${hospital.nombre} se ha eliminado correctamente.`,
            'success'
          ).then(() => this.loadHospitales());
        });
      }
    });
  }

  updateHospital(hospital) {
    swal({
      title: '¿Está seguro?',
      text: `Está a punto de actualizar el hospital ${hospital.nombre}`,
      icon: 'warning',
      buttons: ['Cancelar', 'Actualizar'],
      dangerMode: true
    }).then(res => {
      if (res) {
        this.hospitalesService.update(hospital).subscribe(() => {
          swal(
            'Hospital actualizado',
            `El hospital ${hospital.nombre} se ha actualizado correctamente.`,
            'success'
          ).then(() => this.loadHospitales());
        });
      }
    });
  }

  showModal(id: string) {
    this.modalUploadService.showModal('hospitales', id);
  }
}
