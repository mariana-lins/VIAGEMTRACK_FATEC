export interface Continente {
  id: number;
  nome: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    paises: number;
  };
}

export interface Pais {
  id: number;
  nome: string;
  populacao?: string | number;
  idiomaOficial?: string;
  idioma?: string;
  moeda?: string;
  codigoPais?: string;
  codigoISO?: string;
  capital?: string;
  continenteId: number;
  createdAt: string;
  updatedAt: string;
  continente?: {
    id: number;
    nome: string;
  };
  _count?: {
    cidades: number;
  };
}

export interface Cidade {
  id: number;
  nome: string;
  populacao?: number;
  latitude?: number;
  longitude?: number;
  clima?: string;
  visitada?: boolean;
  paisId: number;
  createdAt: string;
  updatedAt: string;
  pais?: {
    id: number;
    nome: string;
    codigoISO?: string;
    continente?: {
      id: number;
      nome: string;
    };
  };
  _count?: {
    visitas: number;
  };
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  createdAt: string;
  _count?: {
    visitas: number;
  };
}

export interface Visita {
  id: number;
  usuarioId: number;
  cidadeId: number;
  dataVisita: string;
  comentario?: string;
  createdAt: string;
  updatedAt: string;
  cidade?: Cidade;
  usuario?: {
    id: number;
    nome: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
    uv: number;
  };
}

export interface GeoNamesCity {
  geonameId: number;
  name: string;
  countryCode: string;
  countryName: string;
  population: number;
  lat: string;
  lng: string;
}

export interface GeoNamesCountry {
  countryCode: string;
  countryName: string;
  capital: string;
  population: number;
  languages: string;
  currencyCode: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}
