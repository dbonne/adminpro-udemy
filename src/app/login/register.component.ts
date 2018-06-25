import { Component, OnInit } from '@angular/core';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    init_plugins();
  }
}
