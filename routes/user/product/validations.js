const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    // getProductsSchema: yup.object({
    //     query: yup.object({
    //         category: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
    //             if (!value) return true;
    //             return ObjectId.isValid(value);
    //         }),
    //         sup: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
    //             if (!value) return true;
    //             return ObjectId.isValid(value);
    //         }),
    //         productName: yup.string(),
    //         stockStart: yup.number().min(0),
    //         stockEnd: yup.number(),
    //         priceStart: yup.number().min(0),
    //         priceEnd: yup.number(),
    //         discountStart: yup.number().min(0),
    //         discountEnd: yup.number().max(50),
    //         skip: yup.number(),
    //         limit: yup.number(),
    //     }),
    // }),

    getProductsSchema: yup.object({
        query: yup.object({
            categoryId: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
                if (!value) return true;
                return ObjectId.isValid(value);
            }),
            priceStart: yup.number().test('Giá không hợp lệ', (value, context) => {
                if (!value) return true; // Không điền giá kết thúc

                if (context.parent.priceEnd) {
                    return value < context.parent.priceEnd // Giá kết thúc phải lớn hơn giá bắt đầu (nếu có)
                };

                return value > 0;
            }),
            priceEnd: yup.number().test('Giá không hợp lệ', (value, context) => {
                if (!value) return true; // Không điền giá kết thúc

                if (context.parent.priceStart) {
                    return value > context.parent.priceStart; // Giá kết thúc phải lớn hơn giá bắt đầu (nếu có)
                }

                return value > 0;
            }),
            page: yup.number().min(0),
            limit: yup.number().min(2),

            supplierId: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
                if (!value) return true;
                return ObjectId.isValid(value);
            }),
            name: yup.string(),
            stockStart: yup.number().min(0),
            stockEnd: yup.number(),
            discountStart: yup.number().min(0),
            discountEnd: yup.number().max(50),
            skip: yup.number(),
            limit: yup.number(),
        }),
    }),

    getProductSchema: yup.object({
        params: yup.object({
            id: yup.string().test('validationID', 'ID sai định dạng', (value) => {
                return ObjectId.isValid(value);
            }),
        }),
    }),

    createProductSchema: yup.object({
        body: yup.object({
            name: yup.string().required().max(50, 'Tên sản phẩm không được vượt quá 50 ký tự'),
            description: yup.string().required().max(500, 'Mô tả sản phẩm không được vượt quá 500 ký tự'),
            price: yup.number().required().min(0),
            discount: yup.number().required().min(0).max(75),
            stock: yup.number().required().min(0),
            categoryId: yup.string().required().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
                if (!value) return true;
                return ObjectId.isValid(value);
            }),
            supplierId: yup.string().required().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
                if (!value) return true;
                return ObjectId.isValid(value);
            }),
        }),
    }),
};