import { Usuario } from './usuario.model';

export interface BusquedaUsuarios {
  ok: boolean;
  usuarios: Usuario[];
  total?: number;
}
