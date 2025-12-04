import axios from 'axios';

const GEONAMES_BASE_URL = 'http://api.geonames.org';
const username = process.env.GEONAMES_USERNAME || 'demo';

export interface GeoNamesCountry {
  countryCode: string;
  countryName: string;
  capital: string;
  population: number;
  languages: string;
  currencyCode: string;
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

export class GeoNamesService {
  /**
   * Buscar informações de todos os países
   */
  static async buscarPaises(): Promise<GeoNamesCountry[]> {
    try {
      const response = await axios.get(`${GEONAMES_BASE_URL}/countryInfoJSON`, {
        params: {
          username,
          lang: 'pt'
        }
      });

      return response.data.geonames || [];
    } catch (error) {
      console.error('Erro ao buscar países na GeoNames:', error);
      throw new Error('Erro ao buscar países');
    }
  }

  /**
   * Buscar informações de um país específico por código
   */
  static async buscarPaisPorCodigo(codigo: string): Promise<GeoNamesCountry | null> {
    try {
      const response = await axios.get(`${GEONAMES_BASE_URL}/countryInfoJSON`, {
        params: {
          country: codigo.toUpperCase(),
          username,
          lang: 'pt'
        }
      });

      const paises = response.data.geonames || [];
      return paises.length > 0 ? paises[0] : null;
    } catch (error) {
      console.error('Erro ao buscar país na GeoNames:', error);
      return null;
    }
  }

  /**
   * Buscar país por nome (case insensitive)
   */
  static async buscarPaisPorNome(nome: string): Promise<GeoNamesCountry | null> {
    try {
      const response = await axios.get(`${GEONAMES_BASE_URL}/countryInfoJSON`, {
        params: {
          username
        }
      });

      const paises: GeoNamesCountry[] = response.data.geonames || [];
      const nomeLower = nome.toLowerCase().trim();
      
      // 1. Buscar correspondência exata (case insensitive)
      const paisExato = paises.find(p => 
        p.countryName.toLowerCase() === nomeLower
      );
      
      if (paisExato) return paisExato;
      
      // 2. Buscar correspondência por palavra inicial
      const paisPorInicio = paises.find(p => 
        p.countryName.toLowerCase().startsWith(nomeLower)
      );
      
      if (paisPorInicio) return paisPorInicio;
      
      // 3. Buscar cada palavra do nome do país
      const paisPorPalavra = paises.find(p => {
        const palavras = p.countryName.toLowerCase().split(/\s+/);
        return palavras.some(palavra => palavra === nomeLower || palavra.startsWith(nomeLower));
      });
      
      if (paisPorPalavra) return paisPorPalavra;
      
      // 4. Buscar correspondência parcial (contém o termo) - última opção
      const paisParcial = paises.find(p => 
        p.countryName.toLowerCase().includes(nomeLower) &&
        p.countryName.length < nomeLower.length * 3 // Evitar resultados muito distantes
      );
      
      return paisParcial || null;
    } catch (error) {
      console.error('Erro ao buscar país por nome na GeoNames:', error);
      return null;
    }
  }

  /**
   * Buscar cidades por nome
   */
  static async buscarCidades(nomeCidade: string, maxResults: number = 10): Promise<GeoNamesCity[]> {
    try {
      const response = await axios.get(`${GEONAMES_BASE_URL}/searchJSON`, {
        params: {
          q: nomeCidade,
          maxRows: maxResults,
          username,
          lang: 'pt',
          featureClass: 'P', // P = populated places (cidades)
          orderby: 'population'
        }
      });

      return response.data.geonames || [];
    } catch (error) {
      console.error('Erro ao buscar cidades na GeoNames:', error);
      throw new Error('Erro ao buscar cidades');
    }
  }

  /**
   * Buscar cidades por país
   */
  static async buscarCidadesPorPais(codigoPais: string, maxResults: number = 20): Promise<GeoNamesCity[]> {
    try {
      const response = await axios.get(`${GEONAMES_BASE_URL}/searchJSON`, {
        params: {
          country: codigoPais.toUpperCase(),
          maxRows: maxResults,
          username,
          lang: 'pt',
          featureClass: 'P',
          orderby: 'population'
        }
      });

      return response.data.geonames || [];
    } catch (error) {
      console.error('Erro ao buscar cidades por país na GeoNames:', error);
      throw new Error('Erro ao buscar cidades');
    }
  }

  /**
   * Buscar informações de uma cidade específica por coordenadas
   */
  static async buscarCidadePorCoordenadas(lat: number, lng: number): Promise<GeoNamesCity | null> {
    try {
      const response = await axios.get(`${GEONAMES_BASE_URL}/findNearbyPlaceNameJSON`, {
        params: {
          lat,
          lng,
          username,
          lang: 'pt',
          maxRows: 1
        }
      });

      const cidades = response.data.geonames || [];
      return cidades.length > 0 ? cidades[0] : null;
    } catch (error) {
      console.error('Erro ao buscar cidade por coordenadas na GeoNames:', error);
      return null;
    }
  }
}
