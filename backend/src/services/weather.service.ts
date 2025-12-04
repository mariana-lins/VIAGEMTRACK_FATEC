import axios from 'axios';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '';
const WEATHER_BASE_URL = 'http://api.weatherapi.com/v1';

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

export class WeatherService {
  /**
   * Obter clima atual por coordenadas
   */
  static async obterClimaPorCoordenadas(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      if (!WEATHER_API_KEY) {
        console.warn('WEATHER_API_KEY não configurada');
        return null;
      }

      const response = await axios.get(`${WEATHER_BASE_URL}/current.json`, {
        params: {
          key: WEATHER_API_KEY,
          q: `${lat},${lon}`,
          lang: 'pt',
          aqi: 'no'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter clima:', error);
      return null;
    }
  }

  /**
   * Obter clima atual por nome da cidade
   */
  static async obterClimaPorCidade(nomeCidade: string): Promise<WeatherData | null> {
    try {
      if (!WEATHER_API_KEY) {
        console.warn('WEATHER_API_KEY não configurada');
        return null;
      }

      const response = await axios.get(`${WEATHER_BASE_URL}/current.json`, {
        params: {
          key: WEATHER_API_KEY,
          q: nomeCidade,
          lang: 'pt',
          aqi: 'no'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter clima por cidade:', error);
      return null;
    }
  }

  /**
   * Obter previsão do tempo para os próximos dias
   */
  static async obterPrevisao(lat: number, lon: number, dias: number = 3): Promise<any> {
    try {
      if (!WEATHER_API_KEY) {
        console.warn('WEATHER_API_KEY não configurada');
        return null;
      }

      const response = await axios.get(`${WEATHER_BASE_URL}/forecast.json`, {
        params: {
          key: WEATHER_API_KEY,
          q: `${lat},${lon}`,
          days: dias,
          lang: 'pt',
          aqi: 'no'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter previsão do tempo:', error);
      return null;
    }
  }
}
