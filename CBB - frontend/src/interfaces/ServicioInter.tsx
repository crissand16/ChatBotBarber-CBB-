export interface Servicio {
  id_servicios: number;
  nombre_servicio: string;
  precio_servicio: number;
  duracion_minutos_servicio: number;
  descripcion_servicio?: string | null;
}