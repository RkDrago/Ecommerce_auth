import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            enum: ['electronics', 'clothing', 'books', 'home', 'toys', 'other'],
        },
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        description: {
            type: String,
            default: '',
            maxlength: 500,
            trim: true,
        },
        imageUrl: {
            type: String,
            default: '',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
)

const ProductModel = mongoose.model('Product', productSchema)

export default ProductModel
