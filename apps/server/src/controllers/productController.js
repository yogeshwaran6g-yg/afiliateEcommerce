import productService from "#src/services/productService.js";
import { rtnRes } from "#src/utils/helper.js";

const productController = {
    createProduct: async function (req, res) {
        try {
            const { name, slug, short_desc, long_desc, category_id, original_price, sale_price } = req.body;

            // 1. Check required fields
            if (!name || !slug || !short_desc || !long_desc || !category_id || original_price === undefined || sale_price === undefined) {
                return rtnRes(res, 400, "Missing required fields");
            }

            // 2. Validate price logic
            const origPrice = parseFloat(original_price);
            const sPrice = parseFloat(sale_price);

            if (isNaN(origPrice) || isNaN(sPrice) || sPrice > origPrice || origPrice < 0 || sPrice < 0) {
                return rtnRes(res, 400, "Invalid price values");
            }

            // 3. Handle Images
            const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
            const productData = { ...req.body, images };

            const result = await productService.create(productData);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.log("err from createProduct ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    },

    getProducts: async function (req, res) {
        try {
            const result = await productService.get(req.query);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.log("err from getProducts ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    },

    getProductById: async function (req, res) {
        try {
            const id = req.params.id || req.query.id;
            if (!id || isNaN(parseInt(id))) return rtnRes(res, 400, "Valid Product ID is required");

            const result = await productService.get({ id });
            const product = result.data?.products?.[0] || null;
            return rtnRes(res, result.code, result.msg, product);
        } catch (err) {
            console.log("err from getProductById ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    },

    updateProduct: async function (req, res) {
        try {
            const id = req.params.id;
            if (!id || isNaN(parseInt(id))) return rtnRes(res, 400, "Valid Product ID is required");

            const { original_price, sale_price } = req.body;

            // Optional price validation
            if (original_price !== undefined || sale_price !== undefined) {
                const currentProductResult = await productService.get({ id });
                if (!currentProductResult.success) return rtnRes(res, 404, "Product not found");

                const currentProduct = currentProductResult.data.products[0];
                const orig = original_price !== undefined ? parseFloat(original_price) : parseFloat(currentProduct.original_price);
                const sale = sale_price !== undefined ? parseFloat(sale_price) : parseFloat(currentProduct.sale_price);

                if (isNaN(orig) || isNaN(sale) || sale > orig) {
                    return rtnRes(res, 400, "Invalid price values");
                }
            }

            // Handle Images (if new images uploaded, potentially merge or replace)
            const productData = { ...req.body };
            if (req.files && req.files.length > 0) {
                productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
            }

            const result = await productService.update(id, productData);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.log("err from updateProduct ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    },

    deleteProduct: async function (req, res) {
        try {
            const id = req.params.id;
            if (!id || isNaN(parseInt(id))) return rtnRes(res, 400, "Valid Product ID is required");

            const result = await productService.delete(id);
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.log("err from deleteProduct ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    },

    toggleProductStatus: async function (req, res) {
        try {
            const id = req.params.id;
            if (!id || isNaN(parseInt(id))) return rtnRes(res, 400, "Valid Product ID is required");

            const { is_active } = req.body;
            if (is_active === undefined) return rtnRes(res, 400, "is_active is required");

            const result = await productService.update(id, { is_active: !!is_active });
            return rtnRes(res, result.code, result.msg, result.data);
        } catch (err) {
            console.log("err from toggleProductStatus ", err);
            return rtnRes(res, 500, "Internal Error");
        }
    }
};

export default productController;
