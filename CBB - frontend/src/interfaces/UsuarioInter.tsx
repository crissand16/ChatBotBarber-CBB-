export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  fecha_registro?: string;
}