import api from './api';
import type { Servicio } from '../interfaces/ServicioInter';

export const obtenerServicios = async (): Promise<Servicio[]> => {
  const respuesta = await api.get<Servicio[]>('/servicios');
  return respuesta.data;
};