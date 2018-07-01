import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { LoginGuard } from '../services/guards/login.guard';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { UserListResolver } from '../resolvers/userlist.resolver';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { HospitalesListResolver } from '../resolvers/hospitales.resolver';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';

const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { titulo: 'Dashboard' }
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: { titulo: 'Progress' }
      },
      {
        path: 'graficas1',
        component: Graficas1Component,
        data: { titulo: 'Graficas' }
      },
      {
        path: 'promesas',
        component: PromesasComponent,
        data: { titulo: 'Promesas' }
      },
      { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        data: { titulo: 'Ajustes del sistema' }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { titulo: 'Perfil del usuario' }
      },
      // Mantenimientos
      {
        path: 'usuarios',
        component: UsersComponent,
        resolve: {
          busqueda: UserListResolver
        },
        data: { titulo: 'Mantenimiento de usuarios' }
      },
      {
        path: 'hospitales',
        component: HospitalesComponent,
        resolve: {
          busqueda: HospitalesListResolver
        },
        data: { titulo: 'Mantenimiento de hospitales' }
      },
      {
        path: 'medicos',
        component: MedicosComponent,
        data: { titulo: 'Mantenimiento de médicos' }
      },
      {
        path: 'medico/:id',
        component: MedicoComponent,
        data: { titulo: 'Detalles de un médico' }
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
