import axios from 'axios';
import type {
  Continente,
  Pais,
  Cidade,
  Usuario,
  Visita,
  PaginatedResponse,
  WeatherData,
  GeoNamesCity,
  GeoNamesCountry,
  AuthResponse,
  LoginCredentials,
  RegisterData
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// CONTINENTES 
export const continentesAPI = {
  listar: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Continente>>('/continentes', { params: { page, limit } }),
  
  buscarPorId: (id: number) =>
    api.get<Continente>(`/continentes/${id}`),
  
  criar: (data: Partial<Continente>) =>
    api.post<Continente>('/continentes', data),
  
  atualizar: (id: number, data: Partial<Continente>) =>
    api.put<Continente>(`/continentes/${id}`, data),
  
  excluir: (id: number) =>
    api.delete(`/continentes/${id}`),
};

// PAÍSES 
export const paisesAPI = {
  listar: (page = 1, limit = 10, continenteId?: number) =>
    api.get<PaginatedResponse<Pais>>('/paises', { 
      params: { page, limit, continenteId } 
    }),
  
  buscarPorId: (id: number) =>
    api.get<Pais>(`/paises/${id}`),
  
  listarPorContinente: (continenteId: number) =>
    api.get<Pais[]>(`/paises/continente/${continenteId}`),
  
  criar: (data: Partial<Pais>) =>
    api.post<Pais>('/paises', data),
  
  atualizar: (id: number, data: Partial<Pais>) =>
    api.put<Pais>(`/paises/${id}`, data),
  
  excluir: (id: number) =>
    api.delete(`/paises/${id}`),
};

// CIDADES
export const cidadesAPI = {
  listar: (page = 1, limit = 10, paisId?: number, continenteId?: number) =>
    api.get<PaginatedResponse<Cidade>>('/cidades', { 
      params: { page, limit, paisId, continenteId } 
    }),
  
  buscarPorId: (id: number) =>
    api.get<Cidade>(`/cidades/${id}`),
  
  listarPorPais: (paisId: number) =>
    api.get<Cidade[]>(`/cidades/pais/${paisId}`),
  
  listarPorContinente: (continenteId: number) =>
    api.get<Cidade[]>(`/cidades/continente/${continenteId}`),
  
  criar: (data: Partial<Cidade>) =>
    api.post<Cidade>('/cidades', data),
  
  atualizar: (id: number, data: Partial<Cidade>) =>
    api.put<Cidade>(`/cidades/${id}`, data),
  
  excluir: (id: number) =>
    api.delete(`/cidades/${id}`),
  
  marcarComoVisitada: (usuarioId: number, cidadeId: number) =>
    api.post<Visita>('/visitas', { usuarioId, cidadeId, dataVisita: new Date().toISOString() }),
};

// USUÁRIOS
export const usuariosAPI = {
  registrar: (data: RegisterData) =>
    api.post<Usuario>('/usuarios/registrar', data),
  
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/usuarios/login', credentials),
  
  perfil: (id: number) =>
    api.get<Usuario>(`/usuarios/${id}`),
};

// VISITAS 
export const visitasAPI = {
  listarPorUsuario: (usuarioId: number, page = 1, limit = 20) =>
    api.get<PaginatedResponse<Visita>>(`/visitas/usuario/${usuarioId}`, { 
      params: { page, limit } 
    }),
  
  verificarVisita: (usuarioId: number, cidadeId: number) =>
    api.get<{ visitada: boolean; visita?: Visita }>(
      `/visitas/verificar/${usuarioId}/${cidadeId}`
    ),
  
  criar: (data: Partial<Visita>) =>
    api.post<Visita>('/visitas', data),
  
  atualizar: (id: number, data: Partial<Visita>) =>
    api.put<Visita>(`/visitas/${id}`, data),
  
  excluir: (id: number) =>
    api.delete(`/visitas/${id}`),
};

// APIs EXTERNAS
export const externalAPI = {
  // GeoNames
  buscarPaises: () =>
    api.get<GeoNamesCountry[]>('/external/geonames/paises'),
  
  buscarPaisPorCodigo: (codigo: string) =>
    api.get<GeoNamesCountry>(`/external/geonames/pais/${codigo}`),
  
  buscarPaisPorNome: (nome: string) =>
    api.get<GeoNamesCountry>('/external/geonames/pais-por-nome', { 
      params: { nome } 
    }),
  
  buscarCidades: (query: string, limit = 10) =>
    api.get<GeoNamesCity[]>('/external/geonames/cidades', { 
      params: { q: query, limit } 
    }),
  
  buscarCidadesPorPais: (codigoPais: string, limit = 20) =>
    api.get<GeoNamesCity[]>('/external/geonames/cidades', { 
      params: { pais: codigoPais, limit } 
    }),
  
  // Weather
  obterClimaPorCoordenadas: (lat: number, lon: number) =>
    api.get<WeatherData>(`/external/weather/coordenadas/${lat}/${lon}`),
  
  buscarClima: (lat: number, lon: number) =>
    api.get<WeatherData>(`/external/weather/coordenadas/${lat}/${lon}`),
  
  obterClimaPorCidade: (nomeCidade: string) =>
    api.get<WeatherData>(`/external/weather/cidade/${nomeCidade}`),
  
  obterPrevisao: (lat: number, lon: number, dias = 3) =>
    api.get(`/external/weather/previsao/${lat}/${lon}`, { params: { dias } }),
  
  // Flags
  obterBandeira: (codigoPais: string) =>
    api.get<{ small: string; medium: string; large: string; xlarge: string }>(
      `/external/flag/${codigoPais}`
    ),
};

export default api;
