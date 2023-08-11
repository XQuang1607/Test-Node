const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    // getSchema: yup.object({
    //   query: yup.object({
    //     category: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
    //       if (!value) return true;
    //       return ObjectId.isValid(value);
    //     }),
    //     sup: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
    //       if (!value) return true;
    //       return ObjectId.isValid(value);
    //     }),
    //     productName: yup.string(),
    //     stockStart: yup.number().min(0),
    //     stockEnd: yup.number(),
    //     priceStart: yup.number().min(0),
    //     priceEnd: yup.number(),
    //     discountStart: yup.number().min(0),
    //     discountEnd: yup.number().max(50),
    //     skip: yup.number(),
    //     limit: yup.number(),
    //   }),
    // }),

    loginSchema: yup.object({
        body: yup.object({
            email: yup.string()
                .required()
                .test('email type', '${path} Không phải email hợp lệ', (value) => {
                    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

                    return emailRegex.test(value);
                }),

            password: yup.string()
                .required()
                .min(6, 'Mật khẩu phải có tối thiểu 6 kí tự')
                .max(12, 'Mật khẩu không được vượt quá 12 ký tự'),
        }),
    }),

    getDetailSchema: yup.object({
        params: yup.object({
            id: yup.string().test('validationID', 'ID sai định dạng', (value) => {
                return ObjectId.isValid(value);
            }),
        }),
    }),

    createSchema: yup.object({
        body: yup.object({
            createdDate: yup.date(),

            shippedDate: yup
                .date()
                .test('check date', '${path} ngày tháng không hợp lệ', (value) => {
                    if (!value) return true;

                    if (value && this.createdDate && value < this.createdDate) {
                        return false;
                    }

                    if (value < new Date()) {
                        return false;
                    }

                    return true;
                }),

            paymentType: yup.string()
                .required()
                .oneOf(['CASH', 'CREDIT CARD'], 'Phương thức thanh toán không hợp lệ'),

            status: yup.string()
                .required()
                .oneOf(['WAITING', 'COMPLETED', 'CANCELED'], 'Trạng thái không hợp lệ'),

            customerId: yup
                .string()
                .test('validationCustomerID', 'ID sai định dạng', (value) => {
                    return ObjectId.isValid(value);
                }),

            // employeeId: yup
            //   .string()
            //   .test('validationEmployeeID', 'ID sai định dạng', (value) => {
            //     if (!value) return true;

            //     return ObjectId.isValid(value);
            //   }),

            orderDetails: yup.array().of(
                yup.object().shape({
                    productId: yup
                        .string()
                        .test('validationProductID', 'ID sai định dạng', (value) => {
                            return ObjectId.isValid(value);
                        }),

                    quantity: yup.number().required().min(0),

                    price: yup.number().required().min(0),

                    discount: yup.number().required().min(0),
                }),
            ),
        }),
    }),

};