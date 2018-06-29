import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/shared/sidebar.service';
import { UserService } from '../../services/user/user.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  user: Usuario;
  constructor(public _sidebar: SidebarService, public userService: UserService) {
    this.user = userService.user;
  }

  ngOnInit() {}
}
