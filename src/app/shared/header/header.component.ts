import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  user: Usuario;

  constructor(public userService: UserService) {
    this.user = userService.user;
  }

  ngOnInit() {}
}
