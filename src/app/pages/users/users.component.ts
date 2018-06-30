import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { Usuario } from '../../models/usuario.model';
import { UserService } from '../../services/user/user.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {
  users: Usuario[] = [];
  from = 0;
  total = 0;
  loading = false;
  termsSubject: Subject<string> = new Subject<string>();

  constructor(
    private userService: UserService,
    private modalUploadService: ModalUploadService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['busqueda'].usuarios;
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

    this.modalUploadService.notification.subscribe(() => this.loadUsers());
  }

  loadUsers() {
    this.loading = true;
    this.userService.loadAll(this.from).subscribe(res => {
      this.total = res.total;
      this.users = res.usuarios;
      this.loading = false;
    });
  }

  nextPage(from: number) {
    console.log(`Total: ${this.total}, From ${this.from + from}`);
    if (this.from + from < 0) {
      return;
    } else if (this.from + from >= this.total) {
      return;
    } else {
      this.from += from;
    }
    this.loadUsers();
  }

  search(term: string) {
    this.termsSubject.next(term);
  }

  private doSearch(term: string) {
    if (term) {
      this.loading = true;
      this.userService.search(term).subscribe(data => {
        this.users = data;
        this.loading = false;
      });
    } else {
      this.loadUsers();
    }
  }

  deleteUser(user: Usuario) {
    if (user._id === this.userService.user._id) {
      swal(
        'No se puede borrar el usuario',
        'No se puede borrar a si mismo',
        'error'
      );
      return;
    }

    swal({
      title: '¿Está seguro?',
      text: `Está a punto de borrar el usuario ${user.nombre}`,
      icon: 'warning',
      buttons: ['Cancelar', 'Eliminar'],
      dangerMode: true
    }).then(res => {
      if (res) {
        this.userService.delete(user._id).subscribe(() => {
          swal(
            'Usuario eliminado',
            `El usuario ${user.nombre} se ha eliminado correctamente.`,
            'success'
          ).then(() => this.loadUsers());
        });
      }
    });
  }

  updateUser(user: Usuario) {
    swal({
      title: '¿Está seguro?',
      text: `Está a punto de actualizar el usuario ${user.nombre}`,
      icon: 'warning',
      buttons: ['Cancelar', 'Actualizar'],
      dangerMode: true
    }).then(res => {
      if (res) {
        this.userService.update(user).subscribe(() => {
          swal(
            'Usuario actualizado',
            `El usuario ${user.nombre} se ha actualizado correctamente.`,
            'success'
          ).then(() => this.loadUsers());
        });
      }
    });
  }

  showModal(id: string) {
    this.modalUploadService.showModal('usuarios', id);
  }
}
