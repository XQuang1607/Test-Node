const JWT = require('jsonwebtoken');

const { Customer } = require('../../../models');
const { generateToken, generateRefreshToken } = require('../../../helpers/jwtHelper');
const jwtSettings = require('../../../constants/jwtSetting');

module.exports = {
    login: async(req, res, next) => {
        try {
            const { email } = req.body;

            const customer = await Customer.findOne({ email }).select('-password').lean();
            console.log('««««« customer »»»»»', customer);
            const token = generateToken(customer, jwtSettings.USER_SECRET);
            const refreshToken = generateRefreshToken(customer._id, jwtSettings.USER_SECRET);


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

    basic: async(req, res, next) => {
        try {
            const customer = await Customer.findById(req.user._id).select('-password').lean();
            const token = generateToken(customer, jwtSettings.USER_SECRET);
            const refreshToken = generateRefreshToken(customer._id, jwtSettings.USER_SECRET);

            res.json({
                token,
                refreshToken,
            });
        } catch (err) {
            res.sendStatus(400);
        }
    },

    changePass: async(req, res, next) => {
        try {
            const { id } = req.user;
            const { currentPassword, newPassword } = req.body;

            if (!id || !currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const customer = await Customer.findOne({ _id: id });
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            if (customer.password !== currentPassword) {
                return res.status(401).json({ error: 'Invalid current password' });
            }

            if (customer.password === newPassword) {
                return res.status(400).json({ error: 'New password must be different from the current password' });
            }

            customer.password = newPassword;
            await customer.save();


            return res.status(200).json({ message: 'Password changed successfully' });

        } catch (err) {
            res.status(400).json({
                statusCode: 400,
                message: 'Lỗii',
            });
        }
    },

    getMe: async(req, res, next) => {
        try {
            res.status(200).json({
                payload: req.user,
            });
        } catch (err) {
            res.sendStatus(500);
        }
    },

    getAll: async(req, res, next) => {
        try {
            let results = await Customer.find()

            return res.send({ code: 200, payload: results });
        } catch (err) {
            return res.status(500).json({ code: 500, error: err });
        }
    },

    getDetail: async(req, res, next) => {
        try {

            let found = await Customer.findById(req.user)

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

            const { email, phoneNumber, address } = data;


            const getEmailExits = Customer.find({ email });
            const getPhoneExits = Customer.find({ phoneNumber });
            const getAddressExits = Customer.find({ address });

            const [foundEmail, foundPhoneNumber, foundAddress] = await Promise.all([getEmailExits, getPhoneExits, getAddressExits]);

            const errors = [];
            if (foundEmail && foundEmail.length > 0) errors.push('Email đã tồn tại');
            // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
            if (foundPhoneNumber && foundPhoneNumber.length > 0) errors.push('Số điện thoại đã tồn tại');
            if (foundAddress && foundAddress.length > 0) errors.push('Địa chỉ đã tồn tại');

            if (errors.length > 0) {
                return res.status(404).json({
                    code: 404,
                    message: "Không thành công",
                    errors,
                });
            }

            console.log('««««« data »»»»»', data);

            const newItem = new Customer(data);

            console.log('««««« newItem »»»»»', newItem);

            let result = await newItem.save();

            return res.send({ code: 200, message: 'Tạo thành công', payload: result, });
        } catch (err) {
            console.log('««««« err »»»»»', err);
            return res.status(500).json({ code: 500, error: err });
        }
    },

    remove: async function(req, res, next) {
        try {

            let found = await Customer.findByIdAndDelete(req.user);

            if (found) {
                return res.send({ code: 200, payload: found, message: 'Xóa thành công' });
            }

            return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
        } catch (err) {
            return res.status(500).json({ code: 500, error: err });
        }
    },

    update: async function(req, res, next) {
        try {
            const updateData = req.body;

            const { email, phoneNumber, address } = updateData;

            const getEmailExits = Customer.find({ email });
            const getPhoneExits = Customer.find({ phoneNumber });
            const getAddressExits = Customer.find({ address });

            const [foundEmail, foundPhoneNumber, foundAddress] = await Promise.all([getEmailExits, getPhoneExits, getAddressExits]);
            const errors = [];
            if (foundEmail && foundEmail.length > 0) errors.push('Email đã tồn tại');
            // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
            if (foundPhoneNumber && foundPhoneNumber.length > 0) errors.push('Số điện thoại đã tồn tại');
            if (foundAddress && foundAddress.length > 0) errors.push('Địa chỉ đã tồn tại');
            if (errors.length > 0) {
                return res.status(404).json({
                    code: 404,
                    message: "Không thành công",
                    errors,
                });
            }

            const found = await Customer.findByIdAndUpdate(req.user, updateData, {
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
            return res.status(500).json({ code: 500, error: error });
        }
    },

};