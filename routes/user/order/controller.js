const { Order, Customer, Employee, Product } = require('../../../models');
const { asyncForEach } = require('../../../utils');

module.exports = {
    login: async(req, res, next) => {
        try {
            const { email } = req.body;

            const customer = await Customer.findOne({ email }).select('-password').lean();
            console.log('««««« customer »»»»»', customer);
            // const token = generateToken(customer, jwtSettings.USER_SECRET);
            // const refreshToken = generateRefreshToken(customer._id, jwtSettings.USER_SECRET);
            const token = generateToken(customer, );
            const refreshToken = generateRefreshToken(customer._id, );

            return res.status(200).json({
                token,
                refreshToken,
            });
        } catch (err) {
            res.status(400).json({
                statusCode: 400,
                message: 'Looi',
            });
        }
    },

    checkRefreshToken: async(req, res, next) => {
        try {
            const { refreshToken } = req.body;

            JWT.verify(refreshToken, jwtSettings.USER_SECRET, async(err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        message: 'refreshToken is invalid',
                    });
                } else {
                    console.log('««««« decoded »»»»»', decoded);
                    const { id } = decoded;

                    const customer = await Customer.findById(id).select('-password').lean();

                    if (customer && customer.isActive) {
                        const token = generateToken(customer, jwtSettings.USER_SECRET);

                        return res.status(200).json({ token });
                    }
                    return res.sendStatus(401);
                }
            });
        } catch (err) {
            res.status(400).json({
                statusCode: 400,
                message: 'Lỗi',
            });
        }
    },

    getAll: async(req, res, next) => {
        try {
            // const { id } = req.user;

            // let results = await Order.find();
            let results = await Order.find({ customerId: req.user })
                .select('-employeeId ');

            return res.send({ code: 200, payload: results });
        } catch (err) {
            return res.status(500).json({ code: 500, error: err });
        }
    },

    getDetail: async(req, res, next) => {
        try {
            const { id } = req.params;

            let found = await Order.findById(id);

            console.log('««««« found »»»»»', found);
            if (found) {
                return res.send({ code: 200, payload: found });
            }
            return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
        } catch (err) {
            res.status(404).json({
                message: 'Get detail fail!!',
                payload: err,
            });
        }
    },

    create: async function(req, res, next) {
        try {
            const data = req.body;

            const { customerId, orderDetails } = data;

            const getCustomer = Customer.findById(customerId);

            const [customer] = await Promise.all([
                getCustomer,
                // getEmployee,
            ]);

            const errors = [];
            if (!customer || customer.isDelete)
                errors.push('Khách hàng không tồn tại');

            await asyncForEach(orderDetails, async(item) => {
                const product = await Product.findById(item.productId);

                if (!product)
                    errors.push(`Sản phẩm ${item.productId} không có trong hệ thống`);
            });


            if (errors.length > 0) {
                return res.status(404).json({
                    code: 404,
                    message: 'Lỗi',
                    errors,
                });
            }

            const newItem = new Order(data);

            let result = await newItem.save();

            //Xử lí xóa ở đây
            await asyncForEach(orderDetails, async(item) => {
                const product = await Product.findById(item.productId);

                //     if (!product)
                //         errors.push(`Sản phẩm ${item.productId} không có trong hệ thống`);
                // });
                if (!product) {
                    errors.push(`Sản phẩm ${item.productId} không có trong hệ thống`);
                } else {
                    // Kiểm tra và giảm số lượng sản phẩm trong kho
                    if (product.quantity < item.quantity) {
                        errors.push(`Sản phẩm ${item.productId} không đủ số lượng trong kho`);
                    } else {
                        product.quantity -= item.quantity;
                        await product.save();
                    }
                }
            });


            return res.send({
                code: 200,
                message: 'Tạo thành công',
                payload: result,
            });
        } catch (err) {
            console.log('««««« err »»»»»', err);
            return res.status(500).json({ code: 500, error: err });
        }
    },

    remove: async function(req, res, next) {
        try {

            let found = await Order.findByIdAndDelete(req.user);

            if (found) {
                return res.send({
                    code: 200,
                    payload: found,
                    message: 'Xóa thành công',
                });
            }

            return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
        } catch (err) {
            return res.status(500).json({ code: 500, error: err });
        }
    },

    update: async function(req, res, next) {
        try {
            const updateData = req.body;

            const { customerId, employeeId, orderDetails } = updateData;

            const getCustomer = Customer.findById(customerId);
            const getEmployee = Employee.findById(employeeId);

            const [customer, employee] = await Promise.all([
                getCustomer,
                getEmployee,
            ]);

            const errors = [];
            if (!customer || customer.isDelete)
                errors.push('Khách hàng không tồn tại');
            if (!employee || employee.isDelete)
                errors.push('Nhân viên không tồn tại');

            await asyncForEach(orderDetails, async(item) => {
                const product = await Product.findById(item.productId);

                if (!product)
                    errors.push(`Sản phẩm ${item.productId} không có trong hệ thống`);
            });

            if (errors.length > 0) {
                return res.status(404).json({
                    code: 404,
                    message: 'Lỗi',
                    errors,
                });
            }

            const found = await Order.findByIdAndUpdate(req.user, updateData, {
                new: true,
            });

            if (found) {
                return res.send({
                    code: 200,
                    message: 'Cập nhật thành công',
                    payload: found,
                });
            }

            return res.status(404).send({ code: 404, message: 'Không tìm thấy' });
        } catch (error) {
            return res.status(500).json({ code: 500, error: err });
        }
    },
};