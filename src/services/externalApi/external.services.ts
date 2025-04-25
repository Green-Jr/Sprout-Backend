
import axios from 'axios';
import utilFunction from '../../utils/utilFunction';

const OPEN_EXCHANGE_APP_ID = process.env.OPEN_EXCHANGE_APP_ID;

export const externalServices = {
  /**
   * Busca productos usando DummyJSON API.
   * @param query Término de búsqueda
   * @param limit Límite de resultados (máx 100 según la API)
   */
  async searchProducts(query: string, limit: number = 20) {
    try {
      const response = await axios.get('https://dummyjson.com/products/search', {
        params: { q: query, limit }
      });

      console.log('DummyJSON response:', response.data);

      if (response.data?.products && response.data.products.length > 0) {
        console.log(`✅ Productos encontrados para la búsqueda: ${query}`);
        return response.data.products;
      } else {
        // Fallback: traducir el término usando Gemini y volver a intentar
        console.log(`🔄 No se encontraron productos para "${query}". Solicitando traducción a inglés con Gemini...`);
        const translated = await utilFunction.translateToEnglishWithGemini(query);
        if (translated && translated.toLowerCase() !== query.toLowerCase()) {
          console.log(`🌐 Traducido "${query}" -> "${translated}". Reintentando búsqueda...`);
          const fallbackResponse = await axios.get('https://dummyjson.com/products/search', {
            params: { q: translated, limit }
          });
          if (fallbackResponse.data?.products && fallbackResponse.data.products.length > 0) {
            return fallbackResponse.data.products;
          }
        }
        console.log(`⚠️ No se encontraron productos para: ${query} (ni con traducción)`);
        return [];
      }
    } catch (error: any) {
      console.error('❌ Error al buscar productos:', error.response?.data || error.message);
      return [];
    }
  },

  /**
   * Obtiene la tasa de cambio actual de USD a COP usando Open Exchange Rates.
   * @returns {Promise<number>} Tasa de cambio USD → COP
   */
  async getUsdToCopRate(): Promise<number> {
    try {
      const response = await axios.get('https://openexchangerates.org/api/latest.json', {
        params: {
          app_id: OPEN_EXCHANGE_APP_ID,
          symbols: 'COP'
        }
      });
      const rate = response.data?.rates?.COP;
      if (typeof rate === 'number') {
        return rate;
      } else {
        throw new Error('No se pudo obtener la tasa de cambio USD → COP');
      }
    } catch (error: any) {
      console.error('❌ Error al obtener la tasa de cambio USD → COP:', error.response?.data || error.message);
      // Puedes retornar una tasa fija de respaldo si lo deseas
      return 4000;
    }
  }
};
