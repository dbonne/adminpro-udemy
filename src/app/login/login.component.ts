import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { UserService } from '../services/user/user.service';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: Usuario;
  auth2: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    init_plugins();
    this.createForm();
    this.googleInit();
  }

  private createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: [''],
      recuerdame: [false]
    });

    const emailValue = localStorage.getItem('email');
    this.loginForm.setValue({
      email: emailValue || '',
      password: '',
      recuerdame: emailValue ? true : false
    });
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          '824352941780-ahtaql970su2s17egjerk8v3tn0t9dmt.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, googleUser => {
      const token = googleUser.getAuthResponse().id_token;
      this.userService
        .loginGoogle(token)
        .subscribe(() => (window.location.href = '#/dashboard'));
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.user = Object.assign({}, this.loginForm.value);
      this.userService
        .login(this.user, this.loginForm.get('recuerdame').value)
        .subscribe(() => this.router.navigate(['/dashboard']));
    } else {
      console.log('Formulario inválido');
    }
  }
}
