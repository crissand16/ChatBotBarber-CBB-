import api from './api';
import type { Usuario } from '../interfaces/UsuarioInter';

export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  const respuesta = await api.get<Usuario[]>('/usuarios');

  return respuesta.data;
};