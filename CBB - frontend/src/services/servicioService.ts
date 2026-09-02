import api from './api';
import type { ApiResponse } from '../interfaces/ApiResponse';
import type { Servicio } from '../interfaces/ServicioInter';

export const obtenerServicios = async (): Promise<Servicio[]> => {
  const { data } = await api.get<ApiResponse<Servicio[]>>('/servicios');
  return data.data;
};

export const obtenerServicioPorId = async (id: number): Promise<Servicio> => {
  const { data } = await api.get<ApiResponse<Servicio>>(`/servicios/${id}`);
  return data.data;
};
