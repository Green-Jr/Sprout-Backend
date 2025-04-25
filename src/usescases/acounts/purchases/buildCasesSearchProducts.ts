
import { Logger } from "../../../utils/interface/logger.interface";
import { HttpRequest, HttpResponse, httpError } from "../../../utils/types/types";
import utilFunction from "../../../utils/utilFunction";

export default function buildCasesSearchProducts({ services }: { services: any }) {
    return async function getSearchProducts(httpRequest: HttpRequest, log: Logger): Promise<HttpResponse> {
        try {
            const logData = log.userData;
            const ID_USER = logData.USER_ID;

            const { query } = httpRequest.query;
            
            if (!query || typeof query !== 'string' || query.trim().length === 0) {
                return utilFunction.httpResponse(400, "Search query is required", 9);
            }

            if (query.length < 3) {
                return utilFunction.httpResponse(400, "Search query must be at least 3 characters", 9);
            }

            // Buscar productos usando DummyJSON (o el servicio que corresponda)
            const products = await services.externalServices.searchProducts(query);

            if (!products || products.length === 0) {
                return utilFunction.httpResponse(404, "No products found", 2);
            }

            // Tasa de conversión USD a COP (puedes actualizarla según la tasa actual)
            const USD_TO_COP = await services.externalServices.getUsdToCopRate();

            // Formatear la respuesta según la estructura de DummyJSON
            const formattedProducts = products.map((product: any) => ({
                id: product.id,
                title: product.title,
                price: product.price,
                price_cop: Math.round(product.price * USD_TO_COP),
                brand: product.brand,
                category: product.category,
                description: product.description,
                thumbnail: product.thumbnail,
                images: product.images,
                rating: product.rating,
                stock: product.stock,
                // Puedes agregar más campos relevantes aquí
            }));

            log.info(`🔍 Búsqueda de productos por usuario ${ID_USER}: "${query}" - ${products.length} resultados`);

            return utilFunction.httpResponse(200, {
                message: "Products retrieved successfully",
                products: formattedProducts,
                count: products.length
            }, 1);

        } catch (error) {
            const err = error as httpError;
            log.error("Error searching products: " + err.message);
            return utilFunction.httpResponse(500, "Error searching products", 9);
        }
    };
}
