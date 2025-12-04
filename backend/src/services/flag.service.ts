/**
 * Serviço para obter URLs de bandeiras de países
 * Usando Flagpedia API 
 */

export class FlagService {
  private static readonly FLAG_BASE_URL = 'https://flagcdn.com';

  /**
   * Obter URL da bandeira em tamanho médio 
   */
  static getFlagUrl(codigoPais: string, tamanho: 'w20' | 'w40' | 'w80' | 'w160' | 'w320' | 'w640' | 'w1280' = 'w320'): string {
    const codigo = codigoPais.toLowerCase();
    return `${this.FLAG_BASE_URL}/${tamanho}/${codigo}.png`;
  }

  /**
   * Obter múltiplos tamanhos da bandeira
   */
  static getFlagUrls(codigoPais: string) {
    const codigo = codigoPais.toLowerCase();
    return {
      small: `${this.FLAG_BASE_URL}/w40/${codigo}.png`,
      medium: `${this.FLAG_BASE_URL}/w160/${codigo}.png`,
      large: `${this.FLAG_BASE_URL}/w320/${codigo}.png`,
      xlarge: `${this.FLAG_BASE_URL}/w640/${codigo}.png`,
    };
  }

  /**
   * Obter bandeira em formato SVG (vetor)
   */
  static getFlagSvgUrl(codigoPais: string): string {
    const codigo = codigoPais.toLowerCase();
    return `${this.FLAG_BASE_URL}/${codigo}.svg`;
  }
}
