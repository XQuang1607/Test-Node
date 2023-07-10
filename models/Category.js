const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Tên danh mục không được bỏ trống'],
        unique: [true, 'Tên danh mục không được trùng'],
        maxLength: [50, 'Tên danh mục không được vượt quá 50 kí tự']
    },
    description: {
        type: String,
        maxLength: [50, 'Mô tả danh mục không được vượt quá 500 kí tự'],
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
}, );

const Category = model('Category', categorySchema);
module.exports = Category;