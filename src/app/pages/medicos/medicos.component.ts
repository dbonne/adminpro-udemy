import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/medico/medico.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import swal from 'sweetalert';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  medicos = [];
  from = 0;
  total = 0;
  loading = false;
  termsSubject: Subject<string> = new Subject<string>();

  constructor(private medicosService: MedicoService) {}

  ngOnInit() {
    this.medicosService.loadAll().subscribe(res => {
      this.medicos = res.medicos;
      this.total = res.total;
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
  }

  search(term: string) {
    this.termsSubject.next(term);
  }

  newDoctor() {
    console.log('Nuevo doctor');
  }

  doSearch(term: string): any {
    if (term) {
      this.loading = true;
      this.medicosService.search(term).subscribe(data => {
        this.medicos = data.medicos;
        this.total = data.total;
        this.loading = false;
      });
    } else {
      this.loadMedicos();
    }
  }

  loadMedicos() {
    this.loading = true;
    this.medicosService.loadAll(this.from).subscribe(res => {
      this.total = res.total;
      this.medicos = res.medicos;
      this.loading = false;
    });
  }

  deleteMedico(medico) {
    swal({
      title: '¿Está seguro?',
      text: `Está a punto de borrar el médico ${medico.nombre}`,
      icon: 'warning',
      buttons: ['Cancelar', 'Eliminar'],
      dangerMode: true
    }).then(res => {
      if (res) {
        this.medicosService.delete(medico._id).subscribe(() => {
          swal(
            'Médico eliminado',
            `El médico ${medico.nombre} se ha eliminado correctamente.`,
            'success'
          ).then(() => this.loadMedicos());
        });
      }
    });
  }

  nextPage(from: number) {
    if (this.from + from < 0) {
      return;
    } else if (this.from + from >= this.total) {
      return;
    } else {
      this.from += from;
    }
    this.loadMedicos();
  }
}
