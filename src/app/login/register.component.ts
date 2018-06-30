import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import swal from 'sweetalert';
import { Usuario } from '../models/usuario.model';
import { UserService } from '../services/user/user.service';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  user: Usuario;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    init_plugins();
    this.createForm();
  }

  private createForm() {
    this.registerForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        email: ['', Validators.required],
        condiciones: [false, Validators.required],
        password: [
          '',
          [Validators.required, Validators.minLength(4), Validators.maxLength(8)]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validator: this.passwordMatchValidator }
    );

    // Datos de prueba
    this.registerForm.setValue({
      nombre: 'Test',
      email: 'test@change.me',
      password: 'password',
      confirmPassword: 'password',
      condiciones: false
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  registerUser() {
    if (this.registerForm.get('condiciones').value === false) {
      swal('Importante', 'Debe aceptar las condiciones', 'warning');
      return;
    }

    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.userService.create(this.user).subscribe(
        () => this.router.navigate(['/login']),
        error => {
          console.log(error);
          swal('Error', 'Error al registrar el usuario', 'error');
        }
      );
    }
  }
}
