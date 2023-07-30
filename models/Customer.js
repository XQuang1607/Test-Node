const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const bcrypt = require('bcryptjs');

const customerSchema = Schema({
    firstName: {
        type: String,
        required: [true, 'Vui lòng nhập họ của khách hàng'],
        maxLength: [50, 'Họ khách hàng không được quá 50 kí tự'],
    },
    lastName: {
        type: String,
        required: [true, 'Vui lòng nhập tên của khách hàng'],
        maxLength: [50, 'Tên khách hàng không được quá 50 kí tự'],
    },
    gender: {
        type: String,
        // required: true,
        enum: ['Male', 'Female', 'Other'],
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function(value) {
                const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
                return phoneRegex.test(value);
            },
            message: `{value} không phải là số điện thoại hợp lệ`,
        },
    },
    address: {
        type: String,
        maxLength: [500, 'Địa chỉ nhà khách hàng không được vượt quá 500 ký tự'],
        unique: [true, 'Địa chỉ nhà khách hàng không được trùng'],
        required: [true, 'Địa chỉ nhà không được bỏ trống'],
    },
    email: {
        type: String,
        validate: {
            validator: function(value) {
                const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(value);
            },
            message: `{VALUE} không phải là email hợp lệ!`,
            // message: (props) => `{props.value} is not a valid email!`,
        },
        required: [true, 'Email không được bỏ trống'],
        unique: [true, 'Email không được trùng'],

    },
    birthday: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true,
    },
    password: {
        type: String,
        minLength: [6, 'Mật khẩu phải có tối thiểu 6 kí tự'],
        maxLength: [12, 'Mật khẩu không được vượt quá 12 ký tự'],
        required: [true, 'Mật khẩu không được bỏ trống'],
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },

}, {
    versionKey: false,
    timeStamp: true,
}, );

customerSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

customerSchema.pre('save', async function(next) {
    try {
        // generate salt key
        const salt = await bcrypt.genSalt(10); // 10 ký tự ABCDEFGHIK + 123456
        // generate password = salt key + hash key
        const hashPass = await bcrypt.hash(this.password, salt);
        // override password
        this.password = hashPass;

        next();
    } catch (err) {
        next(err);
    }
});

customerSchema.methods.isValidPass = async function(pass) {
    try {
        return await bcrypt.compare(pass, this.password);
    } catch (err) {
        throw new Error(err);
    }
};

// Config
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });
//
customerSchema.plugin(mongooseLeanVirtuals);

const Customer = model('Customer', customerSchema);
module.exports = Customer;