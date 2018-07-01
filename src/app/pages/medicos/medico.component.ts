import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/medico/medico.service';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
  hospitales: Hospital[] = [];
  medico: Medico = {
    hospital: '',
    img: ''
  };
  hospital: Hospital = {
    img: '',
    _id: '',
    nombre: ''
  };

  constructor(
    private medicosService: MedicoService,
    private hospitalService: HospitalService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalUploadService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];

      if (id !== 'nuevo') {
        this.loadMedico(id);
      }
    });

    this.hospitalService.loadAll().subscribe(res => {
      this.hospitales = res.hospitales;
    });

    this.modalService.notification.subscribe(() =>
      this.loadMedico(this.medico._id)
    );
  }

  onHospitalChange(event) {
    if (!event.target.value) {
      this.hospital = { nombre: '' };
      return;
    }
    this.hospitalService.findById(event.target.value).subscribe(hospital => {
      this.hospital = hospital;
    });
  }

  loadMedico(id: string) {
    this.medicosService.findById(id).subscribe(medico => {
      this.medico = {
        _id: medico._id,
        img: medico.img,
        nombre: medico.nombre,
        hospital: medico.hospital._id
      };

      this.hospital = medico.hospital;
    });
  }

  saveMedico(form: NgForm) {
    if (!form.valid) {
      return;
    }

    swal({
      title: `${this.medico._id ? 'Actualizar' : 'Crear'} un medico`,
      text: '¡Esta seguro que desea guardar los cambios?',
      buttons: ['Cancelar', `${this.medico._id ? 'Actualizar' : 'Crear'}`],
      dangerMode: true
    }).then(value => {
      if (value) {
        this.medicosService.createOrUpdate(this.medico).subscribe((res: any) => {
          swal({
            title: `Médico ${this.medico._id ? 'Actualizado' : 'Creado'}`,
            text: 'Operación realizada satisfactoriamente',
            icon: 'success'
          });
          this.medico._id = res.medico._id;
        });
      }
    });
  }

  showModal() {
    this.modalService.showModal('medicos', this.medico._id);
  }
}
